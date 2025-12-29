interface Provider {
  provider_id: number
  provider_name: string
  logo_path: string
}

interface WatchProviders {
  link?: string
  flatrate?: Provider[]
  rent?: Provider[]
  buy?: Provider[]
}

interface StreamingProvidersProps {
  providers: WatchProviders
}

function ProviderLogo({ provider }: { provider: Provider }) {
  const logoUrl = provider.logo_path
    ? `https://image.tmdb.org/t/p/w45${provider.logo_path}`
    : null

  return (
    <div
      className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700"
      title={provider.provider_name}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={provider.provider_name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
          {provider.provider_name.slice(0, 2)}
        </div>
      )}
    </div>
  )
}

export function StreamingProviders({ providers }: StreamingProvidersProps) {
  const hasProviders =
    providers.flatrate?.length ||
    providers.rent?.length ||
    providers.buy?.length

  if (!hasProviders) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
        Where to Watch
      </h3>

      <div className="space-y-4">
        {/* Streaming */}
        {providers.flatrate && providers.flatrate.length > 0 && (
          <div>
            <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Stream
            </h4>
            <div className="flex flex-wrap gap-2">
              {providers.flatrate.map((provider) => (
                <ProviderLogo key={provider.provider_id} provider={provider} />
              ))}
            </div>
          </div>
        )}

        {/* Rent */}
        {providers.rent && providers.rent.length > 0 && (
          <div>
            <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Rent
            </h4>
            <div className="flex flex-wrap gap-2">
              {providers.rent.map((provider) => (
                <ProviderLogo key={provider.provider_id} provider={provider} />
              ))}
            </div>
          </div>
        )}

        {/* Buy */}
        {providers.buy && providers.buy.length > 0 && (
          <div>
            <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Buy
            </h4>
            <div className="flex flex-wrap gap-2">
              {providers.buy.map((provider) => (
                <ProviderLogo key={provider.provider_id} provider={provider} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TMDB attribution */}
      {providers.link && (
        <a
          href={providers.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          View all options on TMDB &rarr;
        </a>
      )}

      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
        Powered by JustWatch
      </p>
    </div>
  )
}
