import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GradientBackground } from '@/components/ui/gradient-background';
import { CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';

const STATUS_API = 'https://status.bxteam.org';

type Service = {
  serviceId: string;
  serviceName: string;
  serviceType: 'monitor' | 'heartbeat';
  status: 'operational' | 'degraded' | 'down';
  responseTime: number;
  error: string | null;
  checkedAt: string;
};

type Incident = {
  id: string;
  service_id: string;
  service_name: string;
  status: 'resolved' | 'investigating' | 'identified';
  error: string;
  started_at: string;
  resolved_at: string | null;
  notes: string | null;
};

type UptimeData = {
  date: string;
  serviceId: string;
  uptime: number;
  avgResponseTime: number;
  totalChecks: number;
};

type UptimeGraphData = Record<string, number>;

async function getStatus(): Promise<Service[]> {
  const res = await fetch(`${STATUS_API}/status`, {
    next: { revalidate: 30 }, // Revalidate every 30 seconds
  });
  if (!res.ok) throw new Error('Failed to fetch status');
  return res.json();
}

async function getUptimeGraph(): Promise<UptimeGraphData[]> {
  const res = await fetch(`${STATUS_API}/api/uptime-graph`, {
    next: { revalidate: 300 }, // 5 minutes
  });
  if (!res.ok) throw new Error('Failed to fetch uptime graph');
  return res.json();
}

async function getIncidents(): Promise<Incident[]> {
  const res = await fetch(`${STATUS_API}/api/incidents`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch incidents');
  return res.json();
}

async function getUptime(): Promise<UptimeData[]> {
  const res = await fetch(`${STATUS_API}/api/uptime`, {
    next: { revalidate: 300 }, // 5 minutes
  });
  if (!res.ok) throw new Error('Failed to fetch uptime');
  return res.json();
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    operational: {
      icon: CheckCircle2,
      text: 'Operational',
      color: 'text-green-500',
    },
    degraded: {
      icon: AlertCircle,
      text: 'Degraded',
      color: 'text-yellow-500',
    },
    down: {
      icon: XCircle,
      text: 'Down',
      color: 'text-red-500',
    },
  };

  const { icon: Icon, text, color } = config[status as keyof typeof config] || config.operational;

  return (
    <div className={`flex items-center gap-2 ${color}`}>
      <Icon className='size-5' />
      <span className='font-medium text-sm'>{text}</span>
    </div>
  );
}

function UptimeBar({ uptime }: { uptime: number | undefined }) {
  const getColor = (value: number | undefined) => {
    if (value === undefined || value === null) return 'bg-neutral-700/30';
    if (value >= 100) return 'bg-green-500';
    if (value >= 98) return 'bg-green-400';
    if (value >= 95) return 'bg-yellow-500';
    if (value >= 90) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const displayValue = uptime !== undefined && uptime !== null ? uptime : 0;

  return (
    <div
      className='group relative h-10 w-1.5 rounded-sm transition-all hover:w-2'
      title={uptime !== undefined && uptime !== null ? `${uptime.toFixed(1)}% uptime` : 'No data'}
    >
      <div className={`h-full w-full rounded-sm ${getColor(uptime)}`} />
      <div className='pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 scale-0 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100'>
        {displayValue.toFixed(1)}%
      </div>
    </div>
  );
}

function UptimeGraph({ serviceId, graphData }: { serviceId: string; graphData: UptimeGraphData[] }) {
  const last20Days = graphData.slice(-20);
  const last90Days = graphData.slice(-90);

  return (
    <>
      <div className='flex items-center gap-1 md:hidden'>
        {last20Days.map((day, index) => (
          <UptimeBar key={index} uptime={day[serviceId]} />
        ))}
      </div>
      <div className='hidden items-center gap-1 md:flex'>
        {last90Days.map((day, index) => (
          <UptimeBar key={index} uptime={day[serviceId]} />
        ))}
      </div>
    </>
  );
}

function ServiceStatus({ service, graphData }: { service: Service; graphData: UptimeGraphData[] }) {
  return (
    <div className='rounded-lg border border-neutral-700/50 bg-neutral-800/30 p-4 backdrop-blur-sm'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-1'>
          <h3 className='font-medium text-white'>{service.serviceName}</h3>
          <p className='text-neutral-400 text-sm'>
            {service.serviceType === 'monitor' ? 'Monitored Service' : 'Heartbeat Service'}
          </p>
        </div>
        <div className='flex items-center gap-6'>
          {service.responseTime && service.serviceType === 'monitor' && (
            <div className='flex items-center gap-2 text-neutral-400'>
              <Clock className='size-4' />
              <span className='text-sm'>{service.responseTime}ms</span>
            </div>
          )}
          <StatusBadge status={service.status} />
        </div>
      </div>
      <div className='mt-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-neutral-400 text-xs md:hidden'>Last 20 days</span>
          <span className='hidden text-neutral-400 text-xs md:inline'>Last 90 days</span>
        </div>
        <UptimeGraph serviceId={service.serviceId} graphData={graphData} />
      </div>
    </div>
  );
}

function IncidentCard({ incident }: { incident: Incident }) {
  const isResolved = incident.status === 'resolved';
  const startDate = new Date(incident.started_at);
  const resolvedDate = incident.resolved_at ? new Date(incident.resolved_at) : null;

  return (
    <div className='rounded-lg border border-neutral-700/50 bg-neutral-800/30 p-4 backdrop-blur-sm'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex-1'>
          <div className='flex items-center gap-2'>
            <h4 className='font-medium text-white'>{incident.service_name}</h4>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                isResolved ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
              }`}
            >
              {isResolved ? 'Resolved' : incident.status}
            </span>
          </div>
          <p className='mt-1 text-neutral-400 text-sm'>{incident.error}</p>
          {incident.notes && <p className='mt-2 text-neutral-500 text-sm italic'>{incident.notes}</p>}
        </div>
        <div className='flex flex-col items-end gap-1 text-neutral-400 text-xs'>
          <span>
            {startDate.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
          {resolvedDate && (
            <span className='text-green-500'>
              Resolved:{' '}
              {resolvedDate.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function UptimeStats({ uptimeData }: { uptimeData: UptimeData[] }) {
  const serviceStats = uptimeData.reduce(
    (acc, curr) => {
      if (!acc[curr.serviceId]) {
        acc[curr.serviceId] = { uptime: 0, count: 0 };
      }
      acc[curr.serviceId].uptime += curr.uptime;
      acc[curr.serviceId].count += 1;
      return acc;
    },
    {} as Record<string, { uptime: number; count: number }>,
  );

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {Object.entries(serviceStats).map(([serviceId, stats]) => {
        const avgUptime = stats.uptime / stats.count;
        return (
          <div
            key={serviceId}
            className='rounded-lg border border-neutral-700/50 bg-neutral-800/30 p-4 backdrop-blur-sm'
          >
            <p className='font-medium text-sm text-white capitalize'>{serviceId}</p>
            <p className='mt-2 font-bold text-3xl text-white'>{avgUptime.toFixed(2)}%</p>
            <p className='mt-1 text-neutral-400 text-xs'>Uptime</p>
          </div>
        );
      })}
    </div>
  );
}

export default async function StatusPage() {
  const [services, incidents, uptimeData, graphData] = await Promise.all([
    getStatus(),
    getIncidents(),
    getUptime(),
    getUptimeGraph(),
  ]);

  const allOperational = services.every(s => s.status === 'operational');

  return (
    <>
      <GradientBackground />
      <div className='container mx-auto max-w-6xl px-4 py-16'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h1 className='font-bold text-4xl text-white sm:text-5xl'>System Status</h1>
          <div className='mt-4 flex items-center justify-center gap-2'>
            {allOperational ? (
              <>
                <CheckCircle2 className='size-6 text-green-500' />
                <p className='text-green-500 text-lg'>All systems operational</p>
              </>
            ) : (
              <>
                <AlertCircle className='size-6 text-yellow-500' />
                <p className='text-yellow-500 text-lg'>Some services are experiencing issues</p>
              </>
            )}
          </div>
        </div>

        {/* Current Status */}
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-3'>
              {services.map(service => (
                <ServiceStatus key={service.serviceId} service={service} graphData={graphData} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Uptime Statistics */}
        {uptimeData.length > 0 && (
          <Card className='mb-8'>
            <CardHeader>
              <CardTitle>Uptime Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <UptimeStats uptimeData={uptimeData} />
            </CardContent>
          </Card>
        )}

        {/* Recent Incidents */}
        {incidents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col gap-3'>
                {incidents.slice(0, 10).map(incident => (
                  <IncidentCard key={incident.id} incident={incident} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {incidents.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-center text-neutral-400'>No incidents reported</p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
