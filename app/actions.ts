'use server';

export async function exampleServerAction(formData: FormData) {
  const name = formData.get('name');
  
  // Simulate some server-side processing
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    message: `Hello ${name}, processed on server!`
  };
}
