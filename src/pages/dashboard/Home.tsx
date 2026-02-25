import { useState, useEffect, useRef } from "react";
import { User, Navigation, Package, MapPin, Store, Check, Truck, Star } from "lucide-react";
import { Switch } from "../../components/ui/switch";
import { Card, CardContent } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import {
  doc, getDoc, collection, query, where, onSnapshot,
  collectionGroup, updateDoc
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Order } from "../../types";
import { useAppStore } from "../../store/useAppStore";
import { t } from "../../i18n/translations";

/* ─────────────────────────────────────────────
   Step Progress Indicator
───────────────────────────────────────────── */
const STEPS = [
  { key: "pending_acceptance", label: "Received" },
  { key: "accepted", label: "Accepted" },
  { key: "picked_up", label: "Picked Up" },
  { key: "delivered", label: "Delivered" },
];

function getStepIndex(status: string) {
  const idx = STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

function StepProgress({ status }: { status: string }) {
  const current = getStepIndex(status);
  return (
    <div className="w-full px-1 pt-1 pb-2">
      <div className="flex items-center justify-between relative">
        {/* Track line */}
        <div className="absolute left-0 right-0 top-[11px] h-[2px] bg-border mx-[14px] z-0" />
        {/* Filled track */}
        <div
          className="absolute left-0 top-[11px] h-[2px] bg-yellow-400 z-0 transition-all duration-700 ease-in-out mx-[14px]"
          style={{ width: current === 0 ? "0%" : `calc(${(current / (STEPS.length - 1)) * 100}% - 0px)` }}
        />

        {STEPS.map((step, i) => {
          const done = i < current;
          const active = i === current;
          const future = i > current;
          return (
            <div key={step.key} className="flex flex-col items-center z-10 gap-1">
              <div
                className={`w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 transition-all duration-500
                  ${done ? "bg-green-500 border-green-500 success-pop" : ""}
                  ${active ? "bg-yellow-400 border-yellow-400 scale-110 shadow-sm" : ""}
                  ${future ? "bg-background border-border" : ""}
                `}
              >
                {done && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                {active && <div className="w-2 h-2 bg-black rounded-full" />}
              </div>
              <span
                className={`text-[9px] font-semibold text-center leading-tight transition-colors duration-300
                  ${done ? "text-green-600" : ""}
                  ${active ? "text-yellow-600" : ""}
                  ${future ? "text-muted-foreground" : ""}
                `}
                style={{ maxWidth: 44 }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Confetti micro-dots (delivered state)
───────────────────────────────────────────── */
function ConfettiDots() {
  const dots = ["🟡", "🟢", "⚪", "🟡", "🟢"];
  return (
    <div className="flex justify-center gap-1 mb-1">
      {dots.map((d, i) => (
        <span
          key={i}
          className="confetti-dot text-[8px]"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {d}
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Slide-to-Confirm Action
   Usage:
     <SlideAction label="Slide to Accept" color="yellow" onConfirm={fn} />
     <SlideAction label="Slide to Decline" color="red"    onConfirm={fn} direction="left" />
───────────────────────────────────────────── */
interface SlideActionProps {
  label: string;
  color: "yellow" | "red" | "purple" | "green";
  onConfirm: () => void;
  loading?: boolean;
  icon?: React.ReactNode;
  direction?: "right" | "left";
}

const TRACK_COLORS = {
  yellow: { track: "bg-yellow-100 dark:bg-yellow-500/20", thumb: "bg-yellow-400", label: "text-yellow-700 dark:text-yellow-300", fill: "bg-yellow-300/60" },
  red: { track: "bg-red-50   dark:bg-red-500/10", thumb: "bg-red-500", label: "text-red-500   dark:text-red-400", fill: "bg-red-300/50" },
  purple: { track: "bg-purple-50 dark:bg-purple-500/10", thumb: "bg-purple-500", label: "text-purple-700 dark:text-purple-300", fill: "bg-purple-300/50" },
  green: { track: "bg-green-50  dark:bg-green-500/10", thumb: "bg-green-500", label: "text-green-700  dark:text-green-400", fill: "bg-green-300/50" },
};

function SlideAction({ label, color, onConfirm, loading = false, icon, direction = "right" }: SlideActionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [done, setDone] = useState(false);
  const startX = useRef(0);
  const dragging = useRef(false);
  const THUMB_W = 52;

  // Reset when loading finishes (parent re-renders)
  useEffect(() => {
    if (!loading) { setOffset(0); setDone(false); }
  }, [loading]);

  const trackWidth = () => (trackRef.current?.offsetWidth ?? 280) - THUMB_W - 8;
  const isLeft = direction === "left";

  const onStart = (clientX: number) => {
    if (done || loading) return;
    dragging.current = true;
    startX.current = clientX;
  };

  const onMove = (clientX: number) => {
    if (!dragging.current || done) return;
    const max = trackWidth();
    let delta = isLeft ? startX.current - clientX : clientX - startX.current;
    delta = Math.max(0, Math.min(delta, max));
    setOffset(delta);
    if (delta >= max - 2) {
      dragging.current = false;
      setDone(true);
      setOffset(max);
      onConfirm();
    }
  };

  const onEnd = () => {
    if (dragging.current) {
      dragging.current = false;
      setOffset(0);
    }
  };

  const max = typeof window !== "undefined" ? trackWidth() : 230;
  const progress = offset / max;
  const colors = TRACK_COLORS[color];

  return (
    <div
      ref={trackRef}
      className={`relative h-[52px] rounded-2xl overflow-hidden select-none touch-none ${colors.track} border border-black/5`}
      onMouseMove={(e) => onMove(e.clientX)}
      onMouseUp={onEnd}
      onMouseLeave={onEnd}
      onTouchMove={(e) => onMove(e.touches[0].clientX)}
      onTouchEnd={onEnd}
    >
      {/* Fill behind thumb */}
      <div
        className={`absolute top-0 bottom-0 ${colors.fill} transition-none`}
        style={isLeft
          ? { right: 0, width: offset + THUMB_W / 2 }
          : { left: 0, width: offset + THUMB_W / 2 }}
      />

      {/* Label — fades as thumb moves */}
      <div
        className={`absolute inset-0 flex items-center justify-center gap-2 text-sm font-bold pointer-events-none ${colors.label}`}
        style={{ opacity: 1 - progress * 1.4 }}
      >
        <span className="opacity-50 text-lg">{isLeft ? "←" : "→"}</span>
        {label}
      </div>

      {/* Thumb */}
      <div
        ref={thumbRef}
        className={`absolute top-[4px] bottom-[4px] w-[${THUMB_W}px] rounded-xl ${colors.thumb}
          flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing
          transition-shadow duration-150`}
        style={{
          width: THUMB_W,
          ...(isLeft
            ? { right: 4 + offset }
            : { left: 4 + offset }),
        }}
        onMouseDown={(e) => { e.preventDefault(); onStart(e.clientX); }}
        onTouchStart={(e) => { onStart(e.touches[0].clientX); }}
      >
        {loading ? (
          <div className="flex gap-0.5">
            {[0, 1, 2].map(i => (
              <span key={i} className={`dot-bounce-${i + 1} inline-block w-1.5 h-1.5 bg-white rounded-full`} />
            ))}
          </div>
        ) : done ? (
          <Check className="w-5 h-5 text-white" strokeWidth={3} />
        ) : (
          <span className="text-white text-lg select-none">{isLeft ? "←" : "→"}</span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Single Order Card
───────────────────────────────────────────── */
interface IncomingOrder {
  storeOrderPath: string;
  storeOrderId: string;
  orderId: string;
  customerName: string;
  deliveryAddress: any;
  storeTotal: number;
  storeName: string;
  deliveryStatus: string;
  storeStatus: string;
}

function OrderCard({
  order,
  actionLoading,
  onAction,
}: {
  order: IncomingOrder;
  actionLoading: string | null;
  onAction: (path: string, status: "accepted" | "declined" | "picked_up" | "delivered") => void;
}) {
  const [justDelivered, setJustDelivered] = useState(false);
  const mountedRef = useRef(false);
  const isNew = order.deliveryStatus === "pending_acceptance";
  const isAccepted = order.deliveryStatus === "accepted";
  const isPickedUp = order.deliveryStatus === "picked_up";
  const isDelivered = order.deliveryStatus === "delivered";

  useEffect(() => {
    if (!mountedRef.current && isDelivered) setJustDelivered(true);
    mountedRef.current = true;
  }, [isDelivered]);

  const dropLabel =
    typeof order.deliveryAddress === "object"
      ? order.deliveryAddress?.area ||
      order.deliveryAddress?.city ||
      order.deliveryAddress?.street ||
      "See details"
      : order.deliveryAddress || "—";

  /* Border colour by status */
  const borderClass =
    isNew ? "border-yellow-400 glow-pulse" :
      isAccepted ? "border-green-400 border-glow-green" :
        isPickedUp ? "border-purple-400" :
          isDelivered ? "border-green-500" : "border-border";

  return (
    <div
      className={`order-card-enter rounded-2xl border-2 bg-card shadow-md transition-all duration-500 overflow-hidden
        ${borderClass}
        ${isDelivered ? "shadow-green-200 dark:shadow-green-900" : ""}
      `}
    >
      {/* ── HEADER ── */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-bold tracking-wider text-foreground">
              #{order.orderId.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{order.storeName}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-extrabold text-foreground">₹{order.storeTotal}</p>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
              ${isNew ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400" : ""}
              ${isAccepted ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" : ""}
              ${isPickedUp ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400" : ""}
              ${isDelivered ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400" : ""}
            `}>
              {isNew && "New Request"}
              {isAccepted && "✔ Accepted"}
              {isPickedUp && "🚚 In Transit"}
              {isDelivered && "✅ Delivered"}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border mx-4" />

      {/* ── ROUTE INFO ── */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center shrink-0">
            <Store className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-xs font-medium text-foreground">Pickup: {order.storeName}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-red-50 dark:bg-red-500/20 flex items-center justify-center shrink-0">
            <MapPin className="w-3 h-3 text-red-500" />
          </div>
          <p className="text-xs font-medium text-foreground">Drop: {dropLabel}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
            <User className="w-3 h-3 text-blue-500" />
          </div>
          <p className="text-xs font-medium text-foreground">{order.customerName}</p>
        </div>
      </div>

      {/* ── STEP PROGRESS ── */}
      <div className="px-4 pb-1">
        <StepProgress status={order.deliveryStatus} />
      </div>

      {/* ── ACTIONS ── */}
      <div className="px-4 pb-4 space-y-2.5">

        {/* ① NEW REQUEST — slide Accept right, slide Decline left */}
        {isNew && (
          <div className="space-y-2 pt-1">
            <SlideAction
              label="Slide to Accept"
              color="yellow"
              icon={<Check className="w-4 h-4" />}
              loading={actionLoading === order.storeOrderPath + "accepted"}
              onConfirm={() => onAction(order.storeOrderPath, "accepted")}
            />
            <SlideAction
              label="Slide to Decline"
              color="red"
              direction="left"
              loading={actionLoading === order.storeOrderPath + "declined"}
              onConfirm={() => onAction(order.storeOrderPath, "declined")}
            />
          </div>
        )}

        {/* ② ACCEPTED — waiting or slide to pick up */}
        {isAccepted && (
          order.storeStatus === "Out for Delivery" ? (
            <SlideAction
              label="Slide — Picked Up"
              color="purple"
              icon={<Package className="w-4 h-4" />}
              loading={actionLoading === order.storeOrderPath + "picked_up"}
              onConfirm={() => onAction(order.storeOrderPath, "picked_up")}
            />
          ) : (
            /* Waiting shimmer state */
            <div className="rounded-xl overflow-hidden">
              <div className="shimmer-bar h-[3px]" />
              <div className="bg-muted/60 rounded-b-xl px-4 py-3 flex items-center justify-center gap-2">
                <span className="flex gap-1 items-center">
                  <span className="dot-bounce-1 inline-block w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                  <span className="dot-bounce-2 inline-block w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                  <span className="dot-bounce-3 inline-block w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Waiting for store to pack…
                </span>
              </div>
            </div>
          )
        )}

        {/* ③ PICKED UP — slide to mark delivered */}
        {isPickedUp && (
          <div className="space-y-2">
            {/* Progress fill bar */}
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="progress-bar-fill h-full bg-gradient-to-r from-purple-400 to-green-400 rounded-full" />
            </div>
            <SlideAction
              label="Slide — Delivered!"
              color="green"
              icon={<Truck className="w-4 h-4" />}
              loading={actionLoading === order.storeOrderPath + "delivered"}
              onConfirm={() => onAction(order.storeOrderPath, "delivered")}
            />
          </div>
        )}

        {/* ④ DELIVERED — success state */}
        {isDelivered && (
          <div className="flex flex-col items-center gap-1 py-2">
            {justDelivered && <ConfettiDots />}
            <div className="success-pop w-12 h-12 rounded-full bg-green-100 dark:bg-green-500/20
                            flex items-center justify-center shadow-md shadow-green-200/60">
              <Star className="w-6 h-6 text-green-500 fill-green-400" />
            </div>
            <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">
              Order Completed!
            </p>
            <p className="text-xs text-muted-foreground">Great job, keep it up 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   HOME SCREEN
═══════════════════════════════════════════ */
export default function Home() {
  const { isOnline, setOnline } = useAppStore();
  const [userData, setUserData] = useState<any>(null);
  const [todayOrders, setTodayOrders] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [incomingOrders, setIncomingOrders] = useState<IncomingOrder[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  /* ── FETCH PROFILE ── */
  useEffect(() => {
    const fetchProfile = async () => {
      const partnerId = localStorage.getItem("partnerId");
      if (!partnerId) return;
      try {
        const docRef = doc(db, "delivery", partnerId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("[DeliveryApp] Profile loaded. deliveryPartnerId =", data?.deliveryPartnerId);
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  /* ── TODAY'S STATS ── */
  useEffect(() => {
    const partnerId = localStorage.getItem("partnerId");
    if (!partnerId) return;

    const q = query(collection(db, "orders"), where("partnerId", "==", partnerId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

      let ordersCount = 0;
      let earnings = 0;

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data() as Order;
        const createdAt = data.createdAt?.toDate
          ? data.createdAt.toDate()
          : new Date(data.createdAt);

        if (
          createdAt >= startOfToday &&
          createdAt <= endOfToday &&
          (data.status === "completed" || data.status === "delivered")
        ) {
          ordersCount++;
          earnings += Number(data.totalAmount) || 0;
        }
      });

      setTodayOrders(ordersCount);
      setTodayEarnings(earnings);
    });

    return () => unsubscribe();
  }, []);

  /* ── INCOMING ORDER LISTENER ── */
  useEffect(() => {
    if (!isOnline) {
      setIncomingOrders([]);
      return;
    }

    // Use the human-readable partner ID (e.g. 'CHE-DP-0002') from profile,
    // OR fall back to the Firestore doc ID from localStorage while profile loads.
    const deliveryPartnerId =
      userData?.deliveryPartnerId ||
      localStorage.getItem("partnerId");

    if (!deliveryPartnerId) {
      console.warn("[DeliveryApp] No deliveryPartnerId — cannot listen for orders");
      return;
    }

    console.log("[DeliveryApp] 🔍 Order listener active for:", deliveryPartnerId);

    const q = query(
      collectionGroup(db, "storeOrders"),
      where("delivery.partnerId", "==", deliveryPartnerId),
      where("delivery.status", "in", ["pending_acceptance", "accepted", "picked_up"])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("[DeliveryApp] 📦 Matched storeOrders:", snapshot.size);
      snapshot.docs.forEach(d =>
        console.log("  →", d.ref.path, "| delivery.status:", d.data().delivery?.status, "| storeStatus:", d.data().storeStatus)
      );

      const orders: IncomingOrder[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          storeOrderPath: docSnap.ref.path,
          storeOrderId: docSnap.id,
          orderId: docSnap.ref.parent?.parent?.id || "—",
          customerName: data.customerName || data.userName || "Customer",
          deliveryAddress: data.deliveryAddress || data.address || "—",
          storeTotal: data.storeTotal || 0,
          storeName: data.storeName || "Store",
          deliveryStatus: data.delivery?.status || "pending_acceptance",
          storeStatus: data.storeStatus || "",
        };
      });
      setIncomingOrders(orders);
    }, (err) => {
      console.error("[DeliveryApp] order listener error:", err);
    });

    return () => unsubscribe();
  }, [isOnline, userData]);

  /* ── ACCEPT / DECLINE ── */
  const handleDeliveryAction = async (
    storeOrderPath: string,
    newStatus: "accepted" | "declined" | "picked_up" | "delivered"
  ) => {
    setActionLoading(storeOrderPath + newStatus);
    try {
      const ref = doc(db, storeOrderPath);
      await updateDoc(ref, { "delivery.status": newStatus });
    } catch (err) {
      console.error("Error updating delivery status:", err);
    } finally {
      setActionLoading(null);
    }
  };

  /* ── UI ── */
  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-background border-b border-border p-4 sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={userData?.basicInfo?.profilePhoto || "https://github.com/shadcn.png"} />
            <AvatarFallback>{userData?.basicInfo?.name?.[0] || "D"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-sm font-bold text-foreground">
              {userData?.basicInfo?.name || t("loading")}
            </h1>
            <p className="text-xs text-muted-foreground">ID: {userData?.deliveryPartnerId ?? "..."}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold ${isOnline ? "text-green-500" : "text-gray-400"}`}>
            {isOnline ? t("online") : t("offline")}
          </span>
          <Switch checked={isOnline} onCheckedChange={setOnline} />
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4">
        {/* Today's Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-yellow-400 border-none rounded-2xl">
            <CardContent className="p-4">
              <p className="text-xs text-yellow-900">{t("earnings")}</p>
              <p className="text-xl font-bold text-black">₹{todayEarnings.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-card rounded-2xl">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{t("orders")}</p>
              <p className="text-xl font-bold text-foreground">{todayOrders}</p>
            </CardContent>
          </Card>
        </div>

        {/* Offline */}
        {!isOnline && (
          <div className="flex-1 flex flex-col items-center justify-center text-center mt-10">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">{t("youAreOffline")}</h2>
            <p className="text-sm text-muted-foreground">{t("goOnlineMsg")}</p>
          </div>
        )}

        {/* Online — Incoming orders */}
        {isOnline && incomingOrders.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-base">🔔</span>
              <h2 className="text-sm font-bold text-foreground">New Order Requests</h2>
              <span className="ml-auto text-xs bg-yellow-400 text-black font-bold px-2 py-0.5 rounded-full">
                {incomingOrders.length}
              </span>
            </div>

            {incomingOrders.map((order) => (
              <OrderCard
                key={order.storeOrderPath}
                order={order}
                actionLoading={actionLoading}
                onAction={handleDeliveryAction}
              />
            ))}
          </div>
        )}

        {/* Online — Looking for orders */}
        {isOnline && incomingOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center mt-10">
            <div className="relative w-20 h-20 mb-6">
              <span className="absolute w-full h-full rounded-full bg-yellow-400/30 animate-ping" />
              <div className="relative w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                <Navigation className="w-8 h-8 text-black" />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-foreground">{t("lookingForOrders")}</h2>
            <p className="text-sm text-muted-foreground">{t("highDemandMsg")}</p>
          </div>
        )}
      </main>
    </div>
  );
}
