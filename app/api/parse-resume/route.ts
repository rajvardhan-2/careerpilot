export async function POST(request: Request) {
  const formData = await request.formData();

  const file = formData.get("resume") as File;

  console.log("Backend received:", file.name);

  return Response.json({
    success: true,
    fileName: file.name,
  });
}