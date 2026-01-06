import { toast } from "sonner";

export function isDigit(str: string) {
  const rakamRegex = /^[0-9]*$/;
  return rakamRegex.test(str);
}

export function showErrors(error: any) {
  console.error("API Error:", error);

  if (error.response?.data?.message) {
    const message = error.response.data.message;

    // Eğer array ise
    if (Array.isArray(message)) {
      message.forEach((m: string) => {
        toast.error(m);
      });
    } 
    // Eğer string ise
    else if (typeof message === 'string') {
      toast.error(message);
    } 
    // Başka bir format ise
    else {
      toast.error("An error occurred");
    }
  } else if (error.response?.data?.error) {
    toast.error(error.response.data.error);
  } else if (error.message) {
    toast.error(error.message);
  } else {
    toast.error("An error occurred");
  }
}