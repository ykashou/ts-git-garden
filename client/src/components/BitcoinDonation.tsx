import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Bitcoin, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getConfig } from "@/lib/staticDataLoader";
import QRCode from "qrcode";

interface BitcoinDonationProps {
  suggestedAmount?: number;
  label?: string;
}

export default function BitcoinDonation({ suggestedAmount, label }: BitcoinDonationProps) {
  const [copied, setCopied] = useState(false);
  const [bitcoinAddress, setBitcoinAddress] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    getConfig().then(config => setBitcoinAddress(config.bitcoinAddress || ""));
  }, []); 
  
  const getBitcoinURI = () => {
    if (!bitcoinAddress) return "";
    
    if (suggestedAmount || label) {
      const params = new URLSearchParams();
      if (suggestedAmount) {
        // Convert USD to approximate BTC (for display only - users should use current rates)
        const btcAmount = (suggestedAmount / 45000).toFixed(6); // Rough conversion
        params.set('amount', btcAmount);
      }
      if (label) {
        params.set('label', label);
      }
      return `bitcoin:${bitcoinAddress}?${params.toString()}`;
    }
    
    return bitcoinAddress;
  };
  
  useEffect(() => {
    // Generate QR code when component mounts and address is available
    if (canvasRef.current && bitcoinAddress) {
      const uri = getBitcoinURI();
      QRCode.toCanvas(canvasRef.current, uri, {
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
  }, [bitcoinAddress, suggestedAmount, label]);
  
  const copyToClipboard = async () => {
    if (!bitcoinAddress) return;
    
    try {
      const textToCopy = getBitcoinURI();
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      console.log('Bitcoin address/URI copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };
  
  if (!bitcoinAddress) {
    return (
      <Card className="border-dashed" data-testid="card-bitcoin-unavailable">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium mb-2">Bitcoin Donations Unavailable</h3>
          <p className="text-sm text-muted-foreground">
            Bitcoin address not configured. Please use GitHub Sponsors for now.
          </p>
        </CardContent>
      </Card>
    );
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
          {label || "Support the Garden"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {suggestedAmount 
            ? `Suggested donation: $${suggestedAmount} (≈ ${(suggestedAmount / 45000).toFixed(6)} BTC)`
            : "Help keep this digital garden growing with a Bitcoin donation"
          }
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
        
        {/* Bitcoin Address/URI */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            {suggestedAmount || label ? "Bitcoin Payment URI:" : "Bitcoin Address:"}
          </p>
          <div className="bg-muted p-3 rounded-md">
            <code className="text-xs font-mono break-all text-foreground">
              {getBitcoinURI()}
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
              {suggestedAmount || label ? "Copy URI" : "Copy Address"}
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