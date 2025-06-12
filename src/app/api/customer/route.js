import prisma from "@/lib/prisma";

export async function GET() {
    const data = await prisma.customer.findMany({
        orderBy: { id: 'asc' },
    });

    return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(request) {
    const { name, phone, email } = await request.json();

    if (!name || !phone) {
        return new Response(JSON.stringify ({ error: 'Bagian name dan phone wajib diisi' }), {
            status: 400,
        });
    }

    const customer = await prisma.customer.create({
        data: { name, phone, email },
    });
    
    return new Response(JSON.stringify(customer), { status: 201 });
}

