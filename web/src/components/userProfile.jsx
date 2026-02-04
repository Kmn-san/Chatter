import { X } from "lucide-react"

export default function UserProfileModal({ isOpen, onClose, currentUser, onChange, value, onSave, handleAvatarChange ,avatarPreview}) {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-base-100 p-6 rounded-lg w-96 relative">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">User Profile</h2>

                    <button
                        type="button"
                        className="btn btn-sm btn-ghost"
                        onClick={onClose}
                        aria-label="Close profile editor"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Avatar */}
                <figure className="flex justify-center mb-4">
                    <label className="cursor-pointer relative group">
                        <img
                            src={avatarPreview||currentUser?.avatar}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border group-hover:opacity-80 transition"
                        />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm">
                            Change
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                    </label>
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
