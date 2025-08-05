'use client';
import { ActionContext } from '@/context/ActionContext';
import { SandpackPreview, useSandpack } from '@codesandbox/sandpack-react';
import React, { useContext, useEffect, useRef } from 'react';
import { toast } from 'sonner';

function SandpackPreviewClient() {
  const previewRef = useRef();
  const { sandpack } = useSandpack();
  const { action, setAction } = useContext(ActionContext);
  
  useEffect(() => {
    GetSandpackCleint();
  }, [sandpack && action]);

  const GetSandpackCleint = async () => {
    try {
      const client = previewRef.current?.getClient();
      if (client) {
        const result = await client.getCodeSandboxURL();
        
        if (action?.actionType == "deploy") {
          const url = result?.previewUrl || ('https://' + result?.sandboxId + ".csb.app/");
          
          // Copy to clipboard and show notification with link
          try {
            await navigator.clipboard.writeText(url);
            toast.success('Deployed! URL copied to clipboard', {
              description: url,
              action: {
                label: 'Open',
                onClick: () => {
                  const link = document.createElement('a');
                  link.href = url;
                  link.target = '_blank';
                  link.rel = 'noopener noreferrer';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              },
              duration: 10000,
            });
          } catch (err) {
            toast.info('Deployment successful!', {
              description: `URL: ${url}`,
              action: {
                label: 'Copy',
                onClick: () => navigator.clipboard.writeText(url)
              },
              duration: 10000,
            });
          }
          setAction(null);
        } else if(action?.actionType == "export" || action?.actionType == "preview") {
          window.open(result?.editorUrl, '_blank');
          setAction(null);
        }
      }
    } catch (error) {
      console.error('Error getting Sandpack client:', error);
    }
  };

  return (
    <SandpackPreview
      ref={previewRef}
      showNavigator={true}
      style={{ height: '80vh' }}
    />
  );
}

export default SandpackPreviewClient;
