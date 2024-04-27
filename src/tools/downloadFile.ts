import emitEvent from "./webSocketHandler";

const downloadFile = async (
  token: string,
  fileId: string,
  name: string,
  type: string,
  content?: string
) => {
  let link;

  if (type.includes("image") && content) {
    const fileBuffer = Buffer.from(content, "base64");
    const file = new File([fileBuffer], name, { type: type });
    const imagePreview = URL.createObjectURL(file);
    link = document.createElement("a");
    link.href = imagePreview;
  } else {
    emitEvent("downloadFile", { token, fileId }, (data: any) => {
      const byteCharacters = atob(data.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray]);

      // Créer un lien pour télécharger le fichier
      const url = window.URL.createObjectURL(blob);
      link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    });
  }

  if (!link) return;
  link.setAttribute("download", name);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
};

export default downloadFile;
