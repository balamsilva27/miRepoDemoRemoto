function UsersList({ users }) {
  return (
    <aside className="users-panel">
      <h2>Usuarios ({users.length})</h2>
      <ul>
        {users.map((user) => (
          <li key={user.userId}>{user.username}</li>
        ))}
      </ul>
      {users.length === 0 && <p className="empty-state">Sin usuarios en la sala.</p>}
    </aside>
  );
}

export default UsersList;
