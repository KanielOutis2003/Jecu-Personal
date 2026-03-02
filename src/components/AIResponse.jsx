export default function AIResponse({ content, loading }) {
  if (loading) {
    return (
      <div className="ai-response" style={{ textAlign: "center" }}>
        <span className="loading-dots">AI is thinking</span>
      </div>
    );
  }
  
  if (!content) return null;
  
  return (
    <div className="ai-response">
      {content}
    </div>
  );
}
