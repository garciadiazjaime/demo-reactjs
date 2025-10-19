import Menu from "./menu"

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html>
            <body style={{
                margin: 0,
                padding: 0,
                height: '100vh',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
                <main style={{
                    height: 'calc(100vh - 100px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    boxSizing: 'border-box'
                }}>
                    {children}
                </main>
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '100px',
                    backgroundColor: '#f8f9fa',
                    borderTop: '1px solid #dee2e6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
                    zIndex: 1000
                }}>
                    <Menu />
                </div>
            </body>
        </html>
    );
}
