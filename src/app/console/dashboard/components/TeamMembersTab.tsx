'use client';

import { useState } from 'react';

interface Member {
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface TeamMembersTabProps {
  setCheckoutMessage: (msg: string) => void;
}

export default function TeamMembersTab({ setCheckoutMessage }: TeamMembersTabProps) {
  // Team Members Dataset (In-Memory React state)
  const [members, setMembers] = useState<Member[]>([
    {
      name: 'Developer Fluxtonx',
      email: 'developer.fluxtonx@gmail.com',
      phone: '+92 3451184105',
      role: 'Admin'
    }
  ]);

  // Modal open states
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showChangeAdminModal, setShowChangeAdminModal] = useState(false);

  // Search filter states
  const [emailFilter, setEmailFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [shrinkFilters, setShrinkFilters] = useState(false);

  // Add Member Form States
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhoneCountry, setNewPhoneCountry] = useState('+44');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');
  const [newRole, setNewRole] = useState('Member');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Change Admin Form States
  const [changeAdminEmail, setChangeAdminEmail] = useState('');
  const [changeAdminPhone, setChangeAdminPhone] = useState('');

  // Submissions
  const handleResetFilters = () => {
    setEmailFilter('');
    setRoleFilter('All');
    setPhoneFilter('');
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== newConfirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (members.length >= 20) {
      alert('Maximum members limit reached (20 members max).');
      return;
    }

    const newMember: Member = {
      name: newUsername,
      email: newEmail,
      phone: `${newPhoneCountry} ${newPhoneNumber}`,
      role: newRole
    };

    setMembers(prev => [...prev, newMember]);
    setCheckoutMessage(`Team member ${newUsername} added successfully.`);
    setTimeout(() => setCheckoutMessage(''), 4000);

    // Reset fields
    setNewUsername('');
    setNewEmail('');
    setNewPhoneNumber('');
    setNewPassword('');
    setNewConfirmPassword('');
    setNewRole('Member');
    setShowAddMemberModal(false);
  };

  const handleChangeAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!changeAdminEmail) return;

    // Find previous admin and target new admin
    const updatedMembers = members.map(m => {
      if (m.role === 'Admin') {
        return { ...m, role: 'Member' }; // Demote previous admin
      }
      if (m.email === changeAdminEmail) {
        return { ...m, role: 'Admin' }; // Promote new admin
      }
      return m;
    });

    setMembers(updatedMembers);
    setCheckoutMessage(`Admin role successfully transferred to ${changeAdminEmail}.`);
    setTimeout(() => setCheckoutMessage(''), 4000);

    setChangeAdminEmail('');
    setChangeAdminPhone('');
    setShowChangeAdminModal(false);
  };

  const handleRemoveMember = (email: string) => {
    const target = members.find(m => m.email === email);
    if (target?.role === 'Admin') {
      alert('You cannot remove the Admin. Transfer the Admin role first.');
      return;
    }

    if (confirm(`Are you sure you want to remove team member ${target?.name}?`)) {
      setMembers(prev => prev.filter(m => m.email !== email));
      setCheckoutMessage('Team member removed successfully.');
      setTimeout(() => setCheckoutMessage(''), 3000);
    }
  };

  // Filter logic
  const filteredMembers = members.filter(m => {
    if (emailFilter && !m.email.toLowerCase().includes(emailFilter.toLowerCase())) return false;
    if (roleFilter !== 'All' && m.role !== roleFilter) return false;
    if (phoneFilter && !m.phone.includes(phoneFilter)) return false;
    return true;
  });

  const currentAdmin = members.find(m => m.role === 'Admin');
  const eligibleNewAdmins = members.filter(m => m.role !== 'Admin');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Horizontal Search & Action Filters Panel */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Email Filter input */}
          <input
            type="text"
            placeholder="Email"
            value={emailFilter}
            onChange={e => setEmailFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 w-44"
          />

          {/* Role Filter select */}
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none text-gray-500 w-36"
          >
            <option value="All">Role</option>
            <option value="Admin">Admin</option>
            <option value="Member">Member</option>
            <option value="Operator">Operator</option>
          </select>

          {/* Phone Filter input */}
          <input
            type="text"
            placeholder="Phone"
            value={phoneFilter}
            onChange={e => setPhoneFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 w-44"
          />

          {/* Actions */}
          <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer">
            Search
          </button>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={() => setShrinkFilters(!shrinkFilters)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            {shrinkFilters ? (
              <>Expand <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg></>
            ) : (
              <>Shrink <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg></>
            )}
          </button>
        </div>

        {/* Action triggers */}
        <div className="flex items-center gap-2 self-end xl:self-center">
          <button
            onClick={() => setShowAddMemberModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1"
          >
            <span>+</span> Add Member
          </button>
          <button
            onClick={() => setShowChangeAdminModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1"
          >
            <span>+</span> Change Admin
          </button>
        </div>
      </div>

      {/* Info labels / occupancies section */}
      <div className="flex justify-between items-center text-xs text-gray-500 font-semibold select-none px-1">
        <span className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => alert('Roles Information:\n- Admin: Full console authority.\n- Member: Management permissions without account editing.\n- Operator: Basic read-only monitoring.')}>
          About Roles <span className="text-gray-400">ⓘ</span>
        </span>
        <span>Members: {members.length} / 20</span>
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-semibold text-xs uppercase bg-gray-50/50 select-none">
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400 font-medium">
                    No matching team members found.
                  </td>
                </tr>
              ) : (
                filteredMembers.map(m => (
                  <tr key={m.email} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-900">{m.name}</td>
                    <td className="px-5 py-4 text-gray-600 font-medium">{m.email}</td>
                    <td className="px-5 py-4 font-mono text-xs text-gray-500">{m.phone}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${m.role === 'Admin' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                        {m.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {m.role !== 'Admin' && (
                        <button
                          onClick={() => handleRemoveMember(m.email)}
                          className="text-red-500 hover:text-red-700 font-semibold text-xs hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
          <span>Total {filteredMembers.length}</span>
          <div className="flex items-center gap-2 select-none">
            <button className="p-1 hover:bg-gray-100 rounded text-gray-400 cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="px-2.5 py-1 bg-blue-600 text-white rounded font-bold shadow-sm">1</span>
            <button className="p-1 hover:bg-gray-100 rounded text-gray-400 cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-55 bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setShowAddMemberModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h4 className="text-sm font-bold text-gray-900">Add Member</h4>

            <form onSubmit={handleAddMemberSubmit} className="space-y-3.5 text-xs">
              {/* User Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <label className="text-gray-500 font-semibold">
                  <span className="text-red-500 mr-0.5">*</span>User Name
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  placeholder="User Name"
                  className="sm:col-span-2 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs w-full"
                  required
                />
              </div>

              {/* Email */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <label className="text-gray-500 font-semibold">
                  <span className="text-red-500 mr-0.5">*</span>Email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="Email"
                  className="sm:col-span-2 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs w-full"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <label className="text-gray-500 font-semibold">Phone Number</label>
                <div className="sm:col-span-2 flex gap-2 w-full">
                  <select
                    value={newPhoneCountry}
                    onChange={e => setNewPhoneCountry(e.target.value)}
                    className="px-2 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none text-xs shrink-0 max-w-[140px]"
                  >
                    <option value="+44">+44 United Kingdom</option>
                    <option value="+1">+1 United States</option>
                    <option value="+92">+92 Pakistan</option>
                    <option value="+65">+65 Singapore</option>
                    <option value="+61">+61 Australia</option>
                  </select>
                  <input
                    type="text"
                    value={newPhoneNumber}
                    onChange={e => setNewPhoneNumber(e.target.value)}
                    placeholder="Phone Number"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <label className="text-gray-500 font-semibold">
                  <span className="text-red-500 mr-0.5">*</span>Password
                </label>
                <div className="sm:col-span-2 relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 select-none text-[10px]"
                  >
                    {showPass ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <label className="text-gray-500 font-semibold">
                  <span className="text-red-500 mr-0.5">*</span>Confirm Password
                </label>
                <div className="sm:col-span-2 relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={newConfirmPassword}
                    onChange={e => setNewConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 select-none text-[10px]"
                  >
                    {showConfirmPass ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Role Select */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <label className="text-gray-500 font-semibold flex items-center gap-1">
                  <span className="text-red-500 mr-0.5">*</span>Role <span className="text-gray-450 cursor-pointer" title="Select console role">ⓘ</span>
                </label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  className="sm:col-span-2 px-3 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500 text-xs w-full"
                  required
                >
                  <option value="Member">Member</option>
                  <option value="Operator">Operator</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-50 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-1.5 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg cursor-pointer shadow-sm"
                >
                  OK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Admin Modal */}
      {showChangeAdminModal && (
        <div className="fixed inset-0 z-55 bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setShowChangeAdminModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h4 className="text-sm font-bold text-gray-900">Change Admin</h4>

            <form onSubmit={handleChangeAdminSubmit} className="space-y-4 text-xs">
              {/* Current Admin displaying */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <span className="text-gray-500 font-semibold">Current Admin</span>
                <span className="sm:col-span-2 font-mono text-gray-700 font-bold break-all">
                  {currentAdmin ? currentAdmin.email : 'developer.fluxtonx@gmail.com'}
                </span>
              </div>

              {/* New Admin Email Select Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <label className="text-gray-500 font-semibold">
                  <span className="text-red-500 mr-0.5">*</span>Email
                </label>
                {eligibleNewAdmins.length === 0 ? (
                  <span className="sm:col-span-2 text-red-500 italic">No other team members available to promote. Add a member first!</span>
                ) : (
                  <select
                    value={changeAdminEmail}
                    onChange={e => {
                      setChangeAdminEmail(e.target.value);
                      const selected = members.find(m => m.email === e.target.value);
                      if (selected) setChangeAdminPhone(selected.phone);
                    }}
                    className="sm:col-span-2 px-3 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none text-xs w-full"
                    required
                  >
                    <option value="">Select target member email</option>
                    {eligibleNewAdmins.map(m => (
                      <option key={m.email} value={m.email}>{m.email} ({m.name})</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Phone display / input confirmation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <label className="text-gray-500 font-semibold">
                  <span className="text-red-500 mr-0.5">*</span>Phone Number
                </label>
                <div className="sm:col-span-2 flex gap-2 w-full">
                  <input
                    type="text"
                    value={changeAdminPhone}
                    readOnly
                    placeholder="Phone number will autofill"
                    className="flex-1 px-3 py-2 border border-gray-150 rounded-xl bg-gray-50 text-gray-700 focus:outline-none text-xs"
                    required
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-50 text-xs">
                <button
                  type="button"
                  onClick={() => setShowChangeAdminModal(false)}
                  className="px-4 py-1.5 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!changeAdminEmail}
                  className={`px-4 py-1.5 font-semibold rounded-lg shadow-sm ${changeAdminEmail ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  OK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
