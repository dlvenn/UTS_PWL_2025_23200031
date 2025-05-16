import prisma from "@/lib/prisma";

export async function GET() {
    const data = await prisma.paket.findMany({
        orderBy: { id: 'asc' },
    });

    return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(request) {
    const { kode, nama, deskripsi } = await request.json();

    if (!kode || !nama || !deskripsi) {
        return new Response(JSON.stringify ({ error: 'Semua field wajib diisi' }), {
            status: 400,
        });
    }
    
    const paket = await prisma.paket.create({
        data: { kode, nama, deskripsi },
    });

    return new Response(JSON.stringify(paket), { status: 201 });
}

