import React from 'react';

export default function ConfirmMoveModal({ open, onClose, children }) {
  return (
    <div className={`fixed inset-0 flex justify-center items-center transition-colors ${open ? 'visible' : 'invisible'}`}>
      <div onClick={e => e.stopPropagation()} className={`bg-white rounded-xl shadow p-6 transition-all ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}>
        {children}
      </div>
    </div>
  )
}