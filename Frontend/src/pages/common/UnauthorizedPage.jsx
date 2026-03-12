import { Link } from 'react-router-dom';
export default function UnauthorizedPage() {
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg-root)',fontFamily:"'Sora',sans-serif",flexDirection:'column',gap:14,textAlign:'center',padding:24}}>
      <div style={{width:52,height:52,borderRadius:14,background:'var(--red-dim)',border:'1px solid rgba(200,16,46,0.25)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <svg width={24} height={24} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="var(--red)"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
      </div>
      <h1 style={{fontSize:22,fontWeight:700,color:'var(--text-1)',margin:0}}>Accès refusé</h1>
      <p style={{fontSize:13,color:'var(--text-3)',margin:0}}>Vous n'avez pas les droits pour accéder à cette page.</p>
      <Link to="/"><button className="btn-primary" style={{marginTop:8}}>Accueil</button></Link>
    </div>
  );
}
