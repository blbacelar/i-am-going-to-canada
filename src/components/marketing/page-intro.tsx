export function PageIntro({ title, body }: { title: string; body: string }) {
  return (
    <header className="page-intro">
      <div className="shell page-intro-grid">
        <h1>{title}</h1>
        <p>{body}</p>
      </div>
    </header>
  );
}
