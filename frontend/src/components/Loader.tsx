export default function Loader() {
    return (
        <div
            className="loader-container"
            role="status"
            aria-label="Loading"
        >
            <div className="loader" />
            <p>Loading dashboard...</p>
        </div>
    );
}