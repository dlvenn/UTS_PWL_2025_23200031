import prisma from "@/lib/prisma";

export async function GET() {
    const data = await prisma.preorder.findMany({
        include: { paket: true, customer: true },
        orderBy: { id: 'asc' },
    });
    return new Response(JSON.stringify(data), { status: 200 });
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

    const selectedPackageInt = parseInt(selected_package);
    if (isNaN(selectedPackageInt)) {
        return new Response(JSON.stringify({ error: 'selected_package dalam bentuk angka' }), {
            status: 400,
        });
    }

    const orderByInt = parseInt(order_by);
    if (isNaN(orderByInt)) {
        return new Response(JSON.stringify({ error: 'order_by dalam bentuk angka' }), {
            status: 400,
        });
    }

    const preorder = await prisma.preorder.create({
        data: { order_date: validOrderDate, order_by: orderByInt, selected_package: selectedPackageInt, qty: parseInt(qty), is_paid },
    });

    // format tampilan
     const formattedPreorder = {
        id: preorder.id,
        order_date: preorder.order_date.toISOString().split('T')[0],
        order_by: preorder.order_by,
        selected_package: preorder.selected_package,
        qty: preorder.qty,
        status: is_paid ? "Lunas" : "Belum Lunas",
    };
    return new Response(JSON.stringify(formattedPreorder), { status: 201 });
}

