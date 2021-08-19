export interface GulpSquooshOptions {
  preprocessOptions?: PreprocessOptions;
  encodeOptions?: EncodeOptions;
}

export type GulpSquooshOptionsFactory = ({
  width,
  height,
  size,
  filePath,
}: {
  width: number;
  height: number;
  size: number;
  filePath: string;
}) => GulpSquooshOptions;

export interface ResizeOptions {
  width?: number;
  height?: number;
}

export interface PreprocessOptions {
  resize?: ResizeOptions;
}

export interface WebpOptions {
  quality?: number;
  target_size?: number;
  target_PSNR?: number;
  method?: number;
  sns_strength?: number;
  filter_strength?: number;
  filter_sharpness?: number;
  filter_type?: number;
  partitions?: number;
  segments?: number;
  pass?: number;
  show_compressed?: number;
  preprocessing?: number;
  autofilter?: number;
  partition_limit?: number;
  alpha_compression?: number;
  alpha_filtering?: number;
  alpha_quality?: number;
  lossless?: number;
  exact?: number;
  image_hint?: number;
  emulate_jpeg_size?: number;
  thread_level?: number;
  low_memory?: number;
  near_lossless?: number;
  use_delta_palette?: number;
  use_sharp_yuv?: number;
}

export interface AvifOptions {
  cqLevel?: number;
  cqAlphaLevel?: number;
  denoiseLevel?: number;
  tileColsLog2?: number;
  tileRowsLog2?: number;
  speed?: number;
  subsample?: number;
  chromaDeltaQ?: boolean;
  sharpness?: number;
  tune?: number;
}

export interface MozjpegOptions {
  quality?: number;
  baseline?: boolean;
  arithmetic?: boolean;
  progressive?: boolean;
  optimize_coding?: boolean;
  smoothing?: number;
  color_space?: number;
  quant_table?: number;
  trellis_multipass?: boolean;
  trellis_opt_zero?: boolean;
  trellis_opt_table?: boolean;
  trellis_loops?: number;
  auto_subsample?: boolean;
  chroma_subsample?: number;
  separate_chroma_quality?: boolean;
  chroma_quality?: number;
}

export interface JxlOptions {
  speed?: number;
  quality?: number;
  progressive?: boolean;
  epf?: number;
  nearLossless?: number;
  lossyPalette?: boolean;
  decodingSpeedTier?: number;
}

export interface OxipngOptions {
  level?: number;
}

export interface Wp2Options {
  quality?: number;
  alpha_quality?: number;
  effort?: number;
  pass?: number;
  sns?: number;
  uv_mode?: number;
  csp_type?: number;
  error_diffusion?: number;
  use_random_matrix?: boolean;
}

export interface EncodeOptions {
  webp?: WebpOptions | "auto";
  avif?: AvifOptions | "auto";
  mozjpeg?: MozjpegOptions | "auto";
  jxl?: JxlOptions | "auto";
  oxipng?: OxipngOptions | "auto";
  wp2?: Wp2Options | "auto";
}

export function gulpSquoosh(
  options?: GulpSquooshOptions | GulpSquooshOptionsFactory
): NodeJS.ReadWriteStream;

export default gulpSquoosh;
