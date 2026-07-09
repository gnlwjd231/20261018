import { useEffect, useRef, useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { VENUE, MAP_LINKS } from '@/data/weddingInfo'

const KAKAO_KEY = import.meta.env.VITE_KAKAO_MAP_KEY as string | undefined

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (cb: () => void) => void
        LatLng: new (lat: number, lng: number) => object
        Map: new (
          el: HTMLElement,
          opts: { center: object; level: number },
        ) => {
          setCenter: (latlng: object) => void
        }
        Marker: new (opts: { position: object; map: object }) => object
        InfoWindow: new (opts: { content: string; removable?: boolean }) => {
          open: (map: object, marker: object) => void
        }
      }
    }
  }
}

function loadKakaoScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.kakao?.maps) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false`
    script.onload = () => {
      window.kakao.maps.load(resolve)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

interface KakaoMapProps {
  mode: 'light' | 'dark'
}

export function KakaoMap({ mode }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(VENUE.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  const addressLine = (
    <div className={`map-address-row map-address-row--${mode}`}>
      <p className={`map-venue-address map-venue-address--${mode}`}>{VENUE.address}</p>
      <button
        type="button"
        className={`map-copy-btn map-copy-btn--${mode}`}
        onClick={copyAddress}
        aria-label="주소 복사"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
    </div>
  )

  useEffect(() => {
    if (!KAKAO_KEY) return

    loadKakaoScript()
      .then(() => {
        setLoaded(true)
      })
      .catch(() => setError(true))
  }, [])

  useEffect(() => {
    if (!loaded || !mapRef.current) return

    const latlng = new window.kakao.maps.LatLng(VENUE.lat, VENUE.lng)
    const map = new window.kakao.maps.Map(mapRef.current, {
      center: latlng,
      level: 4,
    })
    const marker = new window.kakao.maps.Marker({ position: latlng, map })
    const infowindow = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:8px 10px;font-size:13px;font-family:sans-serif;white-space:nowrap;">${VENUE.name}<br/><span style="font-size:11px;color:#888;">${VENUE.address}</span></div>`,
      removable: false,
    })
    infowindow.open(map, marker)
  }, [loaded])

  const mapLinks = (
    <div className={`map-app-links map-app-links--${mode}`} aria-label="지도 앱으로 열기">
      <a
        href={KAKAO_KEY ? MAP_LINKS.kakao : MAP_LINKS.kakaoWeb}
        className={`map-app-btn map-app-btn--kakao map-app-btn--${mode}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="카카오맵에서 길찾기"
      >
        카카오맵
      </a>
      <a
        href={MAP_LINKS.naverWeb}
        className={`map-app-btn map-app-btn--naver map-app-btn--${mode}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="네이버 지도에서 길찾기"
      >
        네이버 지도
      </a>
      <a
        href={MAP_LINKS.tmap}
        className={`map-app-btn map-app-btn--tmap map-app-btn--${mode}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="티맵에서 길찾기"
      >
        티맵
      </a>
    </div>
  )

  // API 키 없거나 로드 실패 시 fallback
  if (!KAKAO_KEY || error) {
    return (
      <div className={`map-fallback map-fallback--${mode}`} aria-label="예식장 위치 정보">
        <div className={`map-fallback-card map-fallback-card--${mode}`}>
          <p className={`map-venue-name map-venue-name--${mode}`}>{VENUE.name}</p>
          {addressLine}
        </div>
        {mapLinks}
      </div>
    )
  }

  return (
    <div className={`map-container map-container--${mode}`} aria-label="예식장 카카오맵">
      <div
        ref={mapRef}
        className="kakao-map"
        role="application"
        aria-label={`${VENUE.name} 위치 지도`}
        style={{ width: '100%', height: '240px' }}
      />
      <div className={`map-venue-info map-venue-info--${mode}`}>
        <p className={`map-venue-name map-venue-name--${mode}`}>{VENUE.name}</p>
        {addressLine}
      </div>
      {mapLinks}
    </div>
  )
}
