export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return Response.json({ error: "URL обязателен" }, { status: 400 });
    }
    const backendResponse = await fetch("http://localhost:8000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!backendResponse.ok) {
      throw new Error("Ошибка при создании задачи");
    }

    const taskData = await backendResponse.json();
    
    return Response.json({
      taskId: taskData.task_id,
      status: taskData.status,
      message: "Обработка начата",
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return Response.json({ error: "taskId обязателен" }, { status: 400 });
    }

    const backendResponse = await fetch(
      `http://localhost:8000/api/tasks/${taskId}`
    );

    if (!backendResponse.ok) {
      if (backendResponse.status === 404) {
        return Response.json({ error: "Задача не найдена" }, { status: 404 });
      }
      throw new Error("Ошибка при проверке статуса");
    }

    const taskStatus = await backendResponse.json();
    
    return Response.json(taskStatus);
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}