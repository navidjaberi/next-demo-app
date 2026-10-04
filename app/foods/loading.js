export default function Loading() {
  return (
    <>
      <div className="skeleton" style={{ height: 40, width: 220, marginBottom: 32 }} />
      <div className="food-grid">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="skeleton" style={{ height: 340 }} />
        ))}
      </div>
    </>
  );
}
