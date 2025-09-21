import { Lock, X } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"



export function UnlockPremiumModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6 rounded-lg shadow-lg">
        <DialogHeader className="flex flex-row items-center justify-between mb-4">
          <DialogTitle className="text-xl font-bold text-gray-900">Unlock Premium Content</DialogTitle>

        </DialogHeader>
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">₹ 2000</p>
          <DialogDescription className="text-sm text-gray-600 mb-6">
            Get unlimited access to all premium chapters, assessments, and exclusive content.
          </DialogDescription>
          <Button className="py-3 text-sm font-semibold text-white rounded-md cursor-pointer bg-gradient-to-r from-[#9333EA] to-[#DB2777] hover:from-[#8628D9] hover:to-[#C2206B] transition-all">
            Subscribe Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
