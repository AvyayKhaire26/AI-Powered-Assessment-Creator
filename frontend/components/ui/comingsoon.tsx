interface Props {
  title: string;
  description: string;
}

export default function ComingSoon({ title, description }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: "70vh",
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          background: "#F5F5F5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <svg width="36" height="36" fill="none" viewBox="0 0 24 24"
          stroke="#A9A9A9" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      {/* Badge */}
      <span
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#F97316",
          background: "#FFF4ED",
          padding: "4px 12px",
          borderRadius: 100,
          marginBottom: 16,
        }}
      >
        Coming Soon
      </span>

      {/* Title */}
      <h2
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: "-0.04em",
          color: "#1A1A1A",
          margin: "0 0 12px 0",
        }}
      >
        {title}
      </h2>

      {/* Description */}
      <p
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 400,
          fontSize: 15,
          color: "#6B6B6B",
          maxWidth: 420,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>
  );
}
