/** A decorative cooling-fan motif, inspired by the mark in the shop's logo. */
export default function FanMotif() {
  return <svg className="brand-fan-motif" viewBox="0 0 400 400" fill="none" aria-hidden="true" focusable="false">
    <circle cx="200" cy="200" r="192" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 12" />
    <circle cx="200" cy="200" r="174" stroke="currentColor" strokeWidth="0.7" />
    <circle cx="200" cy="200" r="146" stroke="currentColor" strokeWidth="0.5" />
    {Array.from({length:8},(_,index)=><path key={index} d="M197 164C161 139 158 83 196 52C239 70 250 113 220 162" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity=".07" transform={'rotate('+index*45+' 200 200)'} />)}
    <circle cx="200" cy="200" r="35" stroke="currentColor" strokeWidth="1" />
    <path d="M200 0V20M200 380V400M0 200H20M380 200H400" stroke="currentColor" />
  </svg>;
}
