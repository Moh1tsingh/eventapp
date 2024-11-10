import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import { prisma } from '@/utils/db';


const supabaseProjectURL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseProjectURL, supabaseAnonKey)


export async function POST(req: Request) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      }
    });

    users.map(async (u) => {
      const token = jwt.sign({ code: u.id + "-" + u.email }, `${process.env.JWT_SECRET}`, { expiresIn: '60d' });

      const qrCodeData = await QRCode.toDataURL(token);
      const qrCodeBlob = new Blob([Buffer.from(qrCodeData.split(',')[1], 'base64')], { type: 'image/png' });

      const { data: qrData, error: qrError } = await supabase.storage
        .from('QRCodes')
        .upload(`public/qr-${u.email.split('@')[0]}.png`, qrCodeBlob, {
          cacheControl: '3600',
          upsert: false,
        });

      if (qrError) {
        console.error('Error uploading QR code:', qrError.message);
        return NextResponse.json({ error: 'Failed to upload QR code' }, { status: 500 });
      }

      const qrCodeImageUrl = supabase.storage.from('QRCodes').getPublicUrl(qrData.path).data.publicUrl;

      // yaha pe jo bhi action lena hoga generate karane ke baad...
      // like adding the link in new column or something
      // const user = await prisma.user.update({
      //   where: { email },
      //   data: {  },
      // });
    })


    return NextResponse.json({ success: true, message: "QR code generated successfully" });
  } catch (error) {
    console.error('Error in PUT request:', error);
    return NextResponse.json({ success: false, error: 'User update failed' }, { status: 500 });
  }
}