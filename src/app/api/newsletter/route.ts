import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'node:crypto';
import { getServiceSupabase } from '@/lib/supabase';

const subscriptionSchema = z.object({
  email: z.string().email('Email inválido'),
  tags: z.array(z.string()).optional().default([]),
  location: z.string().optional(),
  frequency: z.enum(['daily', 'weekly']).default('weekly'),
});

// Helper to persist to Supabase when configured; fallback to in-memory map
const memory = new Map<string, {
  email: string;
  tags: string[];
  location?: string;
  frequency: 'daily' | 'weekly';
  subscribedAt: Date;
  isActive: boolean;
  token: string;
}>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = subscriptionSchema.parse(body);
    const supabase = getServiceSupabase();
    const token = crypto.randomBytes(24).toString('hex');

    if (supabase) {
      const { data: existing, error: err1 } = await supabase
        .from('subscriptions')
        .select('email')
        .eq('email', data.email)
        .maybeSingle();
      if (err1) console.error('supabase select error', err1);
      if (existing) {
        return NextResponse.json({ success: false, error: 'Email já cadastrado' }, { status: 400 });
      }
      const { error } = await supabase.from('subscriptions').insert({
        email: data.email,
        tags: data.tags,
        location: data.location,
        frequency: data.frequency,
        token,
        is_active: true,
      });
      if (error) {
        console.error('supabase insert error', error);
        return NextResponse.json({ success: false, error: 'Erro ao salvar inscrição' }, { status: 500 });
      }
    } else {
      if (memory.has(data.email)) {
        return NextResponse.json({ success: false, error: 'Email já cadastrado' }, { status: 400 });
      }
      memory.set(data.email, {
        ...data,
        isActive: true,
        subscribedAt: new Date(),
        token,
      });
    }

    // TODO: send confirmation email containing the unsubscribe URL with token
    return NextResponse.json({ success: true, message: 'Cadastro realizado com sucesso!', token });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }
    
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') ?? undefined;
    const token = searchParams.get('token') ?? undefined;

    const supabase = getServiceSupabase();
    if (supabase) {
      if (!email && !token) {
        return NextResponse.json({ success: false, error: 'Informe email ou token' }, { status: 400 });
      }
      const query = supabase.from('subscriptions').delete();
      if (token) query.eq('token', token);
      else if (email) query.eq('email', email);
      const { error } = await query;
      if (error) {
        console.error('supabase delete error', error);
        return NextResponse.json({ success: false, error: 'Erro ao cancelar inscrição' }, { status: 500 });
      }
    } else {
      if (!email && !token) {
        return NextResponse.json({ success: false, error: 'Informe email ou token' }, { status: 400 });
      }
      if (email && memory.has(email)) memory.delete(email);
      if (token) {
        for (const [k, v] of memory) {
          if (v.token === token) memory.delete(k);
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Descadastro realizado com sucesso' });
    
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Para admin - visualizar subscriptions
  try {
    const supabase = getServiceSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('is_active, frequency');
      if (error) throw error;
      const total = data.length;
      const active = data.filter((d) => d.is_active).length;
      const byFrequency = {
        daily: data.filter((d) => d.frequency === 'daily').length,
        weekly: data.filter((d) => d.frequency === 'weekly').length,
      };
      return NextResponse.json({ success: true, stats: { total, active, byFrequency } });
    } else {
      const stats = {
        total: memory.size,
        active: Array.from(memory.values()).filter(s => s.isActive).length,
        byFrequency: {
          daily: Array.from(memory.values()).filter(s => s.frequency === 'daily').length,
          weekly: Array.from(memory.values()).filter(s => s.frequency === 'weekly').length,
        },
      };
      return NextResponse.json({ success: true, stats });
    }
  } catch {
    return NextResponse.json(
      { success: false, error: 'Erro interno' },
      { status: 500 }
    );
  }
}
