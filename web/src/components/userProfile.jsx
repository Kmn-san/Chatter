import { X } from "lucide-react"

export default function UserProfileModal({ isOpen, onClose, currentUser, onChange, value, onSave }) {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-base-100 p-6 rounded-lg w-96 relative">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">User Profile</h2>

                    <button
                        className="btn btn-sm btn-ghost"
                        onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Avatar */}
                <figure className="flex justify-center mb-4">
                    <img
                        src={currentUser?.avatar}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                    />
                </figure>

                {/* Info */}
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Name</legend>
                    <input type="text"
                        className="input"
                        placeholder="Insert your name"
                        value={value}
                        onChange={onChange}
                    />
                </fieldset>

                {/* Actions */}
                <div className="mt-6 flex justify-center">
                    <button className="btn btn-primary btn-sm" onClick={onSave}>
                        Save
                    </button>
                </div>

            </div>
        </div>
    )
}
