import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
    const { id } = params;
    const { order_date, order_by, selected_package, qty, status } = await request.json();

    if (!order_date || !order_by || !selected_package || !qty || !status) {
        return new Response(JSON.stringify({ error: 'Field kosong' }), { status: 400 });
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
    
    const preorder = await prisma.preorder.update({
        where: { id: Number(id) },
        data: { order_date: validOrderDate, order_by: orderByInt, selected_package: selectedPackageInt, qty, is_paid },
    });

    // format tampilan
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

export async function DELETE(request, { params }) {
    const { id } = params;

    if (!id) return new Response(JSON.stringify({ error: "ID tidak ditemukan" }), { status: 400 });

    const deletedPreorder = await prisma.preorder.delete({
        where: { id: Number(id) },
    });
    
    return new Response(JSON.stringify({ message: "Berhasil dihapus" }), { status: 200 });
}