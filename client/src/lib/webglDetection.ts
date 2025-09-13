// WebGL detection utility
export function isWebGLAvailable(): boolean {
  try {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    
    // Try to get WebGL context
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return false;
    }
    
    // Basic WebGL functionality test
    const supported = !!(gl && gl.createShader);
    
    // Cleanup
    const ext = gl.getExtension('WEBGL_lose_context');
    if (ext) {
      ext.loseContext();
    }
    
    return supported;
  } catch (e) {
    return false;
  }
}

export function getWebGLInfo(): { supported: boolean; version?: string; vendor?: string; renderer?: string } {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return { supported: false };
    }
    
    const info = {
      supported: true,
      version: gl.getParameter(gl.VERSION),
      vendor: gl.getParameter(gl.VENDOR),
      renderer: gl.getParameter(gl.RENDERER)
    };
    
    // Cleanup
    const ext = gl.getExtension('WEBGL_lose_context');
    if (ext) {
      ext.loseContext();
    }
    
    return info;
  } catch (e) {
    return { supported: false };
  }
}