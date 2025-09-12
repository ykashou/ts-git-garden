import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Bitcoin } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getConfig } from "@/lib/staticDataLoader";
import QRCode from "qrcode";

export default function BitcoinDonation() {
  const [copied, setCopied] = useState(false);
  const [bitcoinAddress, setBitcoinAddress] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    getConfig().then(config => setBitcoinAddress(config.bitcoinAddress || ""));
  }, []); 
  
  useEffect(() => {
    // Generate QR code when component mounts and address is available
    if (canvasRef.current && bitcoinAddress) {
      QRCode.toCanvas(canvasRef.current, bitcoinAddress, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).catch(error => {
        console.error('Failed to generate QR code:', error);
      });
    }
  }, [bitcoinAddress]);
  
  const copyToClipboard = async () => {
    if (!bitcoinAddress) return;
    
    try {
      await navigator.clipboard.writeText(bitcoinAddress);
      setCopied(true);
      console.log('Bitcoin address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };
  
  if (!bitcoinAddress) {
    return null; // Hide component if no Bitcoin address is configured
  }

  return (
    <Card className="hover-elevate" data-testid="card-bitcoin-donation">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-3">
          <div className="p-3 rounded-full bg-orange-100">
            <Bitcoin className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <CardTitle className="text-xl text-foreground">
          Support the Garden
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Help keep this digital garden growing with a Bitcoin donation
        </p>
      </CardHeader>
      
      <CardContent className="text-center space-y-6">
        {/* QR Code */}
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-lg border">
            <canvas 
              ref={canvasRef}
              className="max-w-full h-auto"
              data-testid="qr-code"
            />
          </div>
        </div>
        
        {/* Bitcoin Address */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Bitcoin Address:
          </p>
          <div className="bg-muted p-3 rounded-md">
            <code className="text-xs font-mono break-all text-foreground">
              {bitcoinAddress}
            </code>
          </div>
        </div>
        
        {/* Copy Button */}
        <Button 
          onClick={copyToClipboard}
          variant="secondary"
          size="sm"
          className="w-full hover-elevate"
          data-testid="button-copy-address"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Address
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your donations help support open source development and research. 
          Every contribution, no matter how small, is greatly appreciated! 🙏
        </p>
      </CardContent>
    </Card>
  );
}

// Extend window type for QRCode
declare global {
  interface Window {
    QRCode: any;
  }
}