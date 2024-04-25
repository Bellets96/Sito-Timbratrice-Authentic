import { Toast, ToastHeader, ToastBody } from "reactstrap";

function NotFound() {
  return (
    <div
      className="d-flex justify-content-center pt-5 rounded "
      style={{ fontWeight: "bold" }}
    >
      <Toast className="bg-warning">
        <ToastHeader style={{ fontSize: "1.5rem" }}>
          404 Pagina non trovata
        </ToastHeader>
        <ToastBody style={{ fontSize: "1rem" }}>
          Ops. Sembra che la pagina che hai cercato non esista in questo sito.
        </ToastBody>
      </Toast>
    </div>
  );
}

export default NotFound;
