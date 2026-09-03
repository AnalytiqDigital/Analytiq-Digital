// import { NextResponse } from 'next/server';
// import { writeFile, mkdir } from 'fs/promises';
// import { join } from 'path';
// import { existsSync } from 'fs';
// import { db } from '@/db'; 
// import { media } from '@/db/schema';
// import { revalidatePath } from 'next/cache';

// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
//   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
// };

// // UPDATED: This now handles the GET request from your frontend
// // and returns the actual media files from the database.
// export async function GET() {
//   try {
//     const items = await db.select().from(media);
    
//     return NextResponse.json(
//       { data: items }, 
//       { status: 200, headers: corsHeaders }
//     );
//   } catch (error) {
//     console.error("Failed to fetch media:", error);
//     return NextResponse.json(
//       { error: 'Failed to load media library' }, 
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get('file') as File; 

//     if (!file) {
//       return NextResponse.json({ error: 'No file uploaded' }, { status: 400, headers: corsHeaders });
//     }

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     const uploadDir = join(process.cwd(), 'public', 'uploads');
    
//     if (!existsSync(uploadDir)) {
//       await mkdir(uploadDir, { recursive: true });
//     }

//     const filePath = join(uploadDir, file.name);
//     await writeFile(filePath, buffer);
//     const url = `/uploads/${file.name}`;

//     try {
//       await db.insert(media).values({
//         filename: file.name,
//         url: url,
//       });
//     } catch (dbError) {
//       console.error("Database insert failed:", dbError);
//       return NextResponse.json({ error: 'Saved to folder, but DB failed' }, { status: 500, headers: corsHeaders });
//     }

//     revalidatePath('/admin');
//     revalidatePath('/admin/media');

//     return NextResponse.json({ url, filename: file.name }, { status: 200, headers: corsHeaders });

//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json({ error: 'Upload failed completely' }, { status: 500, headers: corsHeaders });
//   }
// }

// export async function PUT(request: Request) {
//   return POST(request);
// }

// export async function OPTIONS() {
//   return NextResponse.json({ status: "ok" }, { status: 200, headers: corsHeaders });
// }


