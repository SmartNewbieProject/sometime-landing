import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type GiftMessage = Database['public']['Tables']['gift_messages']['Row'];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
) {
  try {
    const { shortId } = await params;

    const { data, error } = await supabase
      .from('gift_messages')
      .select('*')
      .eq('short_id', shortId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    const giftMessage = data as GiftMessage;

    return NextResponse.json({
      message: giftMessage.message,
      applicantName: giftMessage.applicant_name,
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

