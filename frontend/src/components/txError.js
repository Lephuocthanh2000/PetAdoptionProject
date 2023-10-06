export function TxError({ message, dismiss }) {
  return (
    <div className="message-warning" role="alert">
      <div>Error sending transaction:{message}</div>
      <br />
      <button type="button dismiss-button" onClick={dismiss} className="close">
        <div>Dismiss</div>
      </button>
    </div>
  )
}
