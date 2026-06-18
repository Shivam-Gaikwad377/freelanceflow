import React from 'react'
type ClientCardProps = {
  toggleDetails: () => void;
  name: string;
  phone: string;
  email: string;

};

const ClientCard = ({toggleDetails, name, phone, email}: ClientCardProps) => {
  const totalBilled = 12450.00; 
  return (
     <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg hover:shadow-[0_8px_24px_-4px_rgba(70,72,212,0.04)] transition-shadow cursor-pointer group"
                onClick={() => toggleDetails()}>
                <div className="flex justify-between items-start mb-md">
                    <div className="flex items-center gap-md">
                        <div
                            className="w-12 h-12 rounded-full object-cover border bg-inverse-primary border-surface-variant"

                             >
                              {name.charAt(0).toUpperCase() + name.split(' ').map(n => n.charAt(0).toUpperCase()).join('')}
                              </div>
                        <div>
                            <h3
                                className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                                {name}</h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">{email}</p>
                        </div>
                    </div>
                    <span
                        className="inline-flex items-center px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wide">Active</span>
                </div>
                <div className="space-y-sm mb-lg">
                    <div className="flex items-center gap-sm text-on-surface-variant font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-[16px]">mail</span>
                        {email}
                    </div>
                    <div className="flex items-center gap-sm text-on-surface-variant font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-[16px]">call</span>
                        {phone}
                    </div>
                </div>
                <div className="pt-md border-t border-surface-variant flex justify-between items-center">
                    <span className="font-label-md text-label-md text-on-surface-variant">Total Billed</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface">${totalBilled.toLocaleString()}</span>
                </div>
            </div>
  )
}

export default ClientCard;