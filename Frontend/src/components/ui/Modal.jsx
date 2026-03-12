export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div style={{position:'fixed',inset:0,zIndex:50,overflowY:'auto'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',padding:'24px 16px'}}>
        <div className="modal-overlay" onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',backdropFilter:'blur(8px)'}}/>
        <div className="modal-content" style={{position:'relative',zIndex:1,width:'100%',maxWidth:488,background:'var(--bg-card)',border:'1px solid var(--border-mid)',borderRadius:20,boxShadow:'var(--shadow-modal)',fontFamily:"'Sora',sans-serif"}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 22px',borderBottom:'1px solid var(--border)'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:4,height:18,borderRadius:2,background:'var(--accent)'}}/>
              <h3 style={{margin:0,fontSize:14,fontWeight:700,color:'var(--text-1)'}}>{title}</h3>
            </div>
            <button onClick={onClose} style={{display:'flex',alignItems:'center',justifyContent:'center',width:28,height:28,borderRadius:8,background:'transparent',border:'none',cursor:'pointer',color:'var(--text-3)',transition:'background 0.12s,color 0.12s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='var(--bg-elevated)';e.currentTarget.style.color='var(--text-1)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='var(--text-3)';}}>
              <svg width={16} height={16} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div style={{padding:'18px 22px'}}>{children}</div>
        </div>
      </div>
    </div>
  );
}
