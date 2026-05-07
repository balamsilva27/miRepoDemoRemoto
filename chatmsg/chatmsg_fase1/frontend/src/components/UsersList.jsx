function UsersList({ users }) {
  return (
    <div className="users-list">
      <h3>Usuarios en la sala ({users.length})</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <span className="user-avatar">👤</span>
            {user.username}
          </li>
        ))}
        {users.length === 0 && <li className="no-users">No hay usuarios</li>}
      </ul>
    </div>
  );
}

export default UsersList;