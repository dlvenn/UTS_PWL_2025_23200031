import prisma from "@/lib/prisma";

export async function GET() {
    const data = await prisma.preorder.findMany({
        orderBy: { id: 'asc' },
    });

    // format tampilan hasil di Postman
    const formattedData = data.map((item) => ({
        id: item.id,
        order_date: item.order_date.toISOString().split('T')[0],
        selected_package: item.selected_package,
        qty: item.qty,
        status: item.is_paid ? "Lunas" : "Belum Lunas",
      }));

    return new Response(JSON.stringify(formattedData), { status: 200 });
}

export async function POST(request) {
    const { order_date, order_by, selected_package, qty, status } = await request.json();

    if (!order_date || !order_by || !selected_package || !qty || !status) {
        return new Response(JSON.stringify ({ error: 'Semua field wajib diisi' }), {
            status: 400,
        });
    }

    const validOrderDate = new Date(order_date).toISOString();

    const is_paid = status === "Lunas";

    const preorder = await prisma.preorder.create({
        data: { order_date: validOrderDate, order_by, selected_package, qty, is_paid },
    });

    // format tampilan hasil di Postman
    preorder.order_date = preorder.order_date.toISOString().split('T')[0];
    preorder.status = is_paid ? "Lunas" : "Belum Lunas";
    delete preorder.is_paid;

    return new Response(JSON.stringify(preorder), { status: 201 });
}

export async function PUT(request) {
    const { id, order_date, order_by, selected_package, qty, status } = await request.json();
    if (!id || !order_date || !order_by || !selected_package || !qty || !status) return new Response(JSON.stringify({ error: 'Field kosong' }), { status: 400 });

    const validOrderDate = new Date(order_date).toISOString();

    const is_paid = status === "Lunas";
    
    const preorder = await prisma.preorder.update({
        where: { id },
        data: { order_date: validOrderDate, order_by, selected_package, qty, is_paid },
    });

    // format tampilan hasil di Postman
    const formattedPreorder = {
        id: preorder.id,
        order_date: preorder.order_date.toISOString().split('T')[0],
        order_by: preorder.order_by,
        selected_package: preorder.selected_package,
        qty: preorder.qty,
        status: preorder.is_paid ? "Lunas" : "Belum Lunas",
    };

    return new Response(JSON.stringify(formattedPreorder), { status: 200 });
}

export async function DELETE(request) {
    const { id } = await request.json();
    if (!id) return new Response(JSON.stringify({ error: "ID tidak ditemukan" }), { status: 400 });

    await prisma.preorder.delete({ where: { id } });
    return new Response(JSON.stringify({ message: "Berhasil dihapus" }), { status: 200 });
}