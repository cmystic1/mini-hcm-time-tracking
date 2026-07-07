function SummaryCards({ today, formatTimestamp }) {
    const cards = [
        {
            title: "Time In",
            value: formatTimestamp(today?.timeIn),
            color: "success",
        },
        {
            title: "Time Out",
            value: formatTimestamp(today?.timeOut),
            color: "danger",
        },
        {
            title: "Regular Hours",
            value: `${today?.regularHours?.toFixed(2) ?? "0.00"} hrs`,
            color: "primary",
        },
        {
            title: "Late",
            value: `${today?.lateMinutes?.toFixed(0) ?? "0"} mins`,
            color: "warning",
        },
        {
            title: "Overtime",
            value: `${today?.overtimeHours?.toFixed(2) ?? "0.00"} hrs`,
            color: "info",
        },
        {
            title: "Night Differential",
            value: `${today?.nightDifferentialHours?.toFixed(2) ?? "0.00"} hrs`,
            color: "dark",
        },
        {
            title: "Undertime",
            value: `${today?.undertimeMinutes?.toFixed(0) ?? "0"} mins`,
            color: "secondary",
        },
    ];

    return (
        <div className="row g-3">
            {cards.map((card) => (
                <div className="col-12 col-sm-6 col-lg-4" key={card.title}>
                    <div
                        className={`card border-${card.color} shadow h-100`}
                        style={{ borderWidth: "2px", borderRadius: "12px" }}
                    >
                        <div className="card-body">
                            <h6 className="text-muted">{card.title}</h6>
                            <h4 className="fw-bold mb-0" style={{ color: "#0d6efd" }}>
                                {card.value}
                            </h4>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SummaryCards;