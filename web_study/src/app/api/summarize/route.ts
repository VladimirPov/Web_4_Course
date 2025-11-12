export async function GET(request: Request) {
    return Response.json({data: "GET data"})
}

export async function POST(request: Request) {
    const data = await request.json();
    return Response.json(data)
}

export async function DELETE(request: Request) {
    return Response.json({data: "DELETE data"})
}

export async function PUT(request: Request) {
    return Response.json({data: "PUT data"})
}