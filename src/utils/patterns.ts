/**
 * Pattern Generation Utilities
 * Generates SVG and CSS patterns for backgrounds
 */

export type PatternType = 'grid' | 'dots' | 'diagonal' | 'waves' | 'morph' | 'organic';
export type PatternSize = 'small' | 'medium' | 'large';

interface PatternConfig {
  type: PatternType;
  color: string;
  opacity: number;
  size: PatternSize;
}

const PATTERN_SIZES = {
  grid: { small: 20, medium: 40, large: 60 },
  dots: { small: 15, medium: 25, large: 40 },
  diagonal: { small: 20, medium: 40, large: 60 },
  waves: { small: 40, medium: 80, large: 120 },
  morph: { small: 100, medium: 200, large: 300 },
  organic: { small: 80, medium: 150, large: 250 },
};

/**
 * Generate SVG pattern for grid
 */
function generateGridPattern(color: string, opacity: number, size: number): string {
  const svgPattern = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
          <path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="${color}" stroke-width="1" opacity="${opacity}"/>
        </pattern>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#grid)" />
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svgPattern)}`;
}

/**
 * Generate SVG pattern for dots
 */
function generateDotsPattern(color: string, opacity: number, size: number): string {
  const dotSize = size / 5;
  const svgPattern = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
          <circle cx="${size / 2}" cy="${size / 2}" r="${dotSize}" fill="${color}" opacity="${opacity}"/>
        </pattern>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#dots)" />
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svgPattern)}`;
}

/**
 * Generate SVG pattern for diagonal lines
 */
function generateDiagonalPattern(color: string, opacity: number, size: number): string {
  const svgPattern = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="diagonal" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
          <path d="M 0 ${size} L ${size} 0" stroke="${color}" stroke-width="2" opacity="${opacity}"/>
          <path d="M ${-size / 2} ${size / 2} L ${size / 2} ${-size / 2}" stroke="${color}" stroke-width="2" opacity="${opacity}"/>
          <path d="M ${size / 2} ${size * 1.5} L ${size * 1.5} ${size / 2}" stroke="${color}" stroke-width="2" opacity="${opacity}"/>
        </pattern>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#diagonal)" />
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svgPattern)}`;
}

/**
 * Generate SVG pattern for waves
 */
function generateWavesPattern(color: string, opacity: number, size: number): string {
  const amplitude = size / 4;
  const frequency = size / 2;
  
  const svgPattern = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="waves" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
          <path d="M 0 ${size / 2} Q ${frequency / 2} ${size / 2 - amplitude} ${frequency} ${size / 2} T ${size} ${size / 2}" 
                stroke="${color}" stroke-width="2" fill="none" opacity="${opacity}"/>
          <path d="M 0 ${size / 2 + amplitude} Q ${frequency / 2} ${size / 2} ${frequency} ${size / 2 + amplitude} T ${size} ${size / 2 + amplitude}" 
                stroke="${color}" stroke-width="2" fill="none" opacity="${opacity * 0.5}"/>
        </pattern>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#waves)" />
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svgPattern)}`;
}

/**
 * Generate SVG pattern for organic morph shapes
 */
function generateMorphPattern(color: string, opacity: number, size: number): string {
  // Create blob-like organic shapes
  const svgPattern = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="morph" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
          <path d="M ${size * 0.5} ${size * 0.2} 
                   Q ${size * 0.7} ${size * 0.25} ${size * 0.75} ${size * 0.45}
                   Q ${size * 0.8} ${size * 0.65} ${size * 0.6} ${size * 0.75}
                   Q ${size * 0.4} ${size * 0.85} ${size * 0.25} ${size * 0.7}
                   Q ${size * 0.1} ${size * 0.55} ${size * 0.2} ${size * 0.35}
                   Q ${size * 0.3} ${size * 0.15} ${size * 0.5} ${size * 0.2} Z"
                fill="${color}" opacity="${opacity}"/>
        </pattern>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#morph)" />
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svgPattern)}`;
}

/**
 * Generate SVG pattern for organic irregular shapes
 */
function generateOrganicPattern(color: string, opacity: number, size: number): string {
  // Create multiple irregular organic shapes
  const svgPattern = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="organic" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
          <!-- Organic shape 1 -->
          <ellipse cx="${size * 0.3}" cy="${size * 0.3}" rx="${size * 0.15}" ry="${size * 0.2}" 
                   fill="${color}" opacity="${opacity}" transform="rotate(45 ${size * 0.3} ${size * 0.3})"/>
          <!-- Organic shape 2 -->
          <ellipse cx="${size * 0.7}" cy="${size * 0.7}" rx="${size * 0.18}" ry="${size * 0.12}" 
                   fill="${color}" opacity="${opacity * 0.7}" transform="rotate(-30 ${size * 0.7} ${size * 0.7})"/>
          <!-- Organic shape 3 -->
          <circle cx="${size * 0.2}" cy="${size * 0.8}" r="${size * 0.08}" 
                  fill="${color}" opacity="${opacity * 0.5}"/>
          <!-- Organic shape 4 -->
          <ellipse cx="${size * 0.8}" cy="${size * 0.2}" rx="${size * 0.1}" ry="${size * 0.15}" 
                   fill="${color}" opacity="${opacity * 0.6}" transform="rotate(60 ${size * 0.8} ${size * 0.2})"/>
        </pattern>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#organic)" />
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svgPattern)}`;
}

/**
 * Generate pattern background style
 */
export function generatePattern(config: PatternConfig): string {
  const size = PATTERN_SIZES[config.type][config.size];
  
  switch (config.type) {
    case 'grid':
      return generateGridPattern(config.color, config.opacity, size);
    case 'dots':
      return generateDotsPattern(config.color, config.opacity, size);
    case 'diagonal':
      return generateDiagonalPattern(config.color, config.opacity, size);
    case 'waves':
      return generateWavesPattern(config.color, config.opacity, size);
    case 'morph':
      return generateMorphPattern(config.color, config.opacity, size);
    case 'organic':
      return generateOrganicPattern(config.color, config.opacity, size);
    default:
      return '';
  }
}

/**
 * Convert background style to CSS properties
 */
export function getBackgroundStyle(background: {
  type: string;
  color?: string;
  // Support both naming conventions
  from?: string;
  to?: string;
  via?: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientVia?: string;
  direction?: string;
  gradientDirection?: string;
  baseColor?: string;
  pattern?: PatternType;
  patternType?: PatternType;
  patternColor?: string;
  patternOpacity?: number;
  patternSize?: PatternSize;
  imageUrl?: string;
  imageFit?: string;
  imagePosition?: string;
  imageOpacity?: number;
}): React.CSSProperties {
  const style: React.CSSProperties = {};

  switch (background.type) {
    case 'solid':
      style.backgroundColor = background.color || '#ffffff';
      break;

    case 'gradient': {
      const directionMap: Record<string, string> = {
        'to-top': 'to top',
        'to-bottom': 'to bottom',
        'to-left': 'to left',
        'to-right': 'to right',
        'to-top-right': 'to top right',
        'to-top-left': 'to top left',
        'to-bottom-right': 'to bottom right',
        'to-bottom-left': 'to bottom left',
        // Shorthand versions
        'to-t': 'to top',
        'to-b': 'to bottom',
        'to-l': 'to left',
        'to-r': 'to right',
        'to-tr': 'to top right',
        'to-tl': 'to top left',
        'to-br': 'to bottom right',
        'to-bl': 'to bottom left',
      };
      
      // Support both naming conventions
      const fromColor = background.from || background.gradientFrom || '#9333ea';
      const toColor = background.to || background.gradientTo || '#3b82f6';
      const viaColor = background.via || background.gradientVia;
      const dir = background.direction || background.gradientDirection || 'to-bottom';
      
      const direction = directionMap[dir] || 'to bottom';
      let gradientColors = `${fromColor}, ${toColor}`;
      if (viaColor) {
        gradientColors = `${fromColor}, ${viaColor}, ${toColor}`;
      }
      
      style.backgroundImage = `linear-gradient(${direction}, ${gradientColors})`;
      break;
    }

    case 'pattern': {
      style.backgroundColor = background.baseColor || background.color || '#f3f4f6';
      const patType = background.patternType || background.pattern;
      if (patType) {
        const patternUrl = generatePattern({
          type: patType,
          color: background.patternColor || '#000000',
          opacity: background.patternOpacity ?? 0.1,
          size: background.patternSize || 'medium',
        });
        style.backgroundImage = `url("${patternUrl}")`;
        style.backgroundRepeat = 'repeat';
      }
      break;
    }

    case 'image': {
      if (background.imageUrl) {
        style.backgroundImage = `url("${background.imageUrl}")`;
        style.backgroundSize = background.imageFit || 'cover';
        style.backgroundPosition = background.imagePosition || 'center';
        style.backgroundRepeat = 'no-repeat';
        
        if (background.imageOpacity !== undefined && background.imageOpacity < 1) {
          // Use a semi-transparent overlay for image opacity
          style.position = 'relative';
        }
      }
      break;
    }

    case 'video':
      // For video backgrounds, just use a fallback color
      // The actual video is rendered separately in the component
      style.backgroundColor = background.color || '#000000';
      break;

    default:
      style.backgroundColor = '#ffffff';
  }

  return style;
}

/**
 * Get CSS class for gradient direction
 */
export function getGradientClass(direction: string): string {
  const classMap: Record<string, string> = {
    'to-top': 'bg-gradient-to-t',
    'to-bottom': 'bg-gradient-to-b',
    'to-left': 'bg-gradient-to-l',
    'to-right': 'bg-gradient-to-r',
    'to-top-right': 'bg-gradient-to-tr',
    'to-top-left': 'bg-gradient-to-tl',
    'to-bottom-right': 'bg-gradient-to-br',
    'to-bottom-left': 'bg-gradient-to-bl',
  };
  
  return classMap[direction] || 'bg-gradient-to-b';
}
