import { Link } from 'react-router-dom';
export default function NotFoundPage() {
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg-root)',fontFamily:"'Sora',sans-serif",flexDirection:'column',gap:14,textAlign:'center',padding:24}}>
      <p style={{fontSize:72,fontWeight:800,color:'var(--text-4)',margin:0,lineHeight:1,fontFamily:"'JetBrains Mono',monospace",letterSpacing:'-0.05em'}}>404</p>
      <h1 style={{fontSize:22,fontWeight:700,color:'var(--text-1)',margin:0}}>Page introuvable</h1>
      <p style={{fontSize:13,color:'var(--text-3)',margin:0}}>La page que vous cherchez n'existe pas.</p>
      <Link to="/"><button className="btn-primary" style={{marginTop:8}}>Accueil</button></Link>
    </div>
  );
}
