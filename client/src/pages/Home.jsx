import { Toast, ToastHeader, ToastBody } from "reactstrap";

function Home() {
  return (
    <div
      className="d-flex justify-content-center pt-5 rounded"
      style={{ fontWeight: "bold" }}
    >
      <Toast className="bg-warning">
        <ToastHeader style={{ fontSize: "1.5rem" }}>
          Sito web in costruzione
        </ToastHeader>
        <ToastBody style={{ fontSize: "1rem" }}>
          Questo sito web è ancora in fase di costruzione. Al momento le
          funzionalità sono limitate.
        </ToastBody>
      </Toast>
    </div>
  );
}

export default Home;
