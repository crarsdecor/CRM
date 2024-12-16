const UserTable = ({ users, onClose }) => (
    <div style={{ marginTop: "20px" }}>
      <button 
        onClick={onClose} 
        style={{ marginBottom: "10px", padding: "5px 10px", backgroundColor: "#f5222d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
      >
        Close Table
      </button>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>UID</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Enrollment ID Website</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.uid}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.enrollmentIdWebsite}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  export default UserTable;