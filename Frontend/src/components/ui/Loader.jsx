export default function Loader() {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'64px 0',flexDirection:'column',gap:12}}>
      <div style={{width:28,height:28,border:'2.5px solid var(--accent-dim)',borderTopColor:'var(--accent)',borderRadius:'50%',animation:'_oSpin 0.65s linear infinite'}}/>
      <p style={{margin:0,fontSize:11,color:'var(--text-4)',letterSpacing:'0.1em',fontFamily:"'JetBrains Mono',monospace"}}>CHARGEMENT...</p>
    </div>
  );
}
