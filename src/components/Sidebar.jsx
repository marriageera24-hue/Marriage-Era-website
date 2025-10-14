const Sidebar = () => {
  const [selected, setSelected] = useState('all-users');

  const handleSelect = (e) => {
    setSelected(e.target.value);
  };

  return (
    <div className="sidebar">
      <h2>Users</h2>
      <select value={selected} onChange={handleSelect}>
        <option value="all-users">All Users</option>
        <option value="verified-users">Verified Users</option>
        <option value="unverified-users">Unverified Users</option>
      </select>
    </div>
  );
};

export default Sidebar;
