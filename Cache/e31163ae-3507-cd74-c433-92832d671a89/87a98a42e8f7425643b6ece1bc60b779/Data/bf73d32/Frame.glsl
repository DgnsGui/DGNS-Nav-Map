#version 310 es

//-----------------------------------------------------------------------
// Copyright (c) 2019 Snap Inc.
//-----------------------------------------------------------------------

// SCC_FRONTEND_SHADER_FLAGS_BEGIN__
// SCC_FRONTEND_SHADER_FLAGS_END__

// SCC_BACKEND_SHADER_FLAGS_BEGIN__
// SCC_BACKEND_SHADER_FLAG_DISABLE_FRUSTUM_CULLING
// SCC_BACKEND_SHADER_FLAGS_END__


#define SC_FRAG_DATA_COUNT 1


#define NODEFLEX 0 // Hack for now to know if a shader is running in Studio or on a released lens

//-----------------------------------------------------------------------

#define NF_PRECISION highp

//-----------------------------------------------------------------------

// 10-09-2019 - These defines were moved to PBR node but Some old graphs 
//              still have them in their material definition and some compilers
//              don't like them being redefined. Easiest fix for now is to undefine them.

#ifdef ENABLE_LIGHTING
#undef ENABLE_LIGHTING
#endif

#ifdef ENABLE_DIFFUSE_LIGHTING
#undef ENABLE_DIFFUSE_LIGHTING
#endif

#ifdef ENABLE_SPECULAR_LIGHTING
#undef ENABLE_SPECULAR_LIGHTING
#endif

#ifdef ENABLE_TONE_MAPPING
#undef ENABLE_TONE_MAPPING
#endif

//-----------------------------------------------------------------------

#define ENABLE_LIGHTING false
#define ENABLE_DIFFUSE_LIGHTING false
#define ENABLE_SPECULAR_LIGHTING false


//-----------------------------------------------------------------------



//-----------------------------------------------------------------------


//-----------------------------------------------------------------------
// Standard defines
//-----------------------------------------------------------------------


#pragma paste_to_backend_at_the_top_begin
#ifdef borderOnly
#undef borderOnly
#endif

#ifdef cutOutCenter
#undef cutOutCenter
#endif
#pragma paste_to_backend_at_the_top_end


//-----------------------------------------------------------------------
// Standard includes
//-----------------------------------------------------------------------

#include <std3.glsl>
#include <std3_vs.glsl>
#include <std3_texture.glsl>
#include <std3_fs.glsl>
#include <std3_ssao.glsl>
#include <std3_taa.glsl>
#include <std3_voxelData.glsl>





//-------------------
// Global defines
//-------------------

#define SCENARIUM

#ifdef SC_BACKEND_LANGUAGE_MOBILE
#define MOBILE
#endif

#ifdef SC_BACKEND_LANGUAGE_GL
const bool DEVICE_IS_FAST = SC_DEVICE_CLASS >= SC_DEVICE_CLASS_C && bool(SC_GL_FRAGMENT_PRECISION_HIGH);
#else
const bool DEVICE_IS_FAST = SC_DEVICE_CLASS >= SC_DEVICE_CLASS_C;
#endif

const bool SC_ENABLE_SRGB_EMULATION_IN_SHADER = false;


//-----------------------------------------------------------------------
// Varyings
//-----------------------------------------------------------------------

varying vec4 varColor;

//-----------------------------------------------------------------------
// User includes
//-----------------------------------------------------------------------
#include "includes/utils.glsl"		


#include "includes/blend_modes.glsl"
#include "includes/oit.glsl" 

#include "includes/rgbhsl.glsl"
#include "includes/uniforms.glsl"

//-----------------------------------------------------------------------

// The next 60 or so lines of code are for debugging support, live tweaks, node previews, etc and will be included in a 
// shared glsl file.

//-----------------------------------------------------------------------

// Hack for now to know if a shader is running in Studio or on a released lens

#if !defined(MOBILE) && !NODEFLEX
#define STUDIO
#endif

//-----------------------------------------------------------------------

//-----------------------------------------------------------------------
// Basic Macros
//-----------------------------------------------------------------------

// Time Overrides

uniform       int   overrideTimeEnabled;
uniform highp float overrideTimeElapsed[32];
uniform highp float overrideTimeDelta;

//-----------------------------------------------------------------------

#if defined( STUDIO )
#define ssConstOrUniformPrecision	uniform NF_PRECISION
#define ssConstOrUniform			uniform
#else
#define ssConstOrUniformPrecision   const
#define ssConstOrUniform    		const
#endif

//--------------------------------------------------------

// When compiling the shader for rendering in a node-based editor, we need any unconnected dynamic input port's value to
// be tweakable in real-time so we expose it to the engine as a uniform. If we're compiling the shader for a release build
// we use a literal or const value

#if defined( STUDIO )
#define NF_PORT_CONSTANT( xValue, xUniform )	xUniform
#else
#define NF_PORT_CONSTANT( xValue, xUniform )	xValue
#endif

//--------------------------------------------------------

#define float2   vec2
#define float3   vec3
#define float4   vec4
#define bool2    bvec2
#define bool3    bvec3
#define bool4    bvec4
#define float2x2 mat2
#define float3x3 mat3
#define float4x4 mat4

//--------------------------------------------------------

#define ssConditional( C, A, B ) ( ( C * 1.0 != 0.0 ) ? A : B )
#define ssEqual( A, B )          ( ( A == B ) ? 1.0 : 0.0 )
#define ssNotEqual( A, B )       ( ( A == B ) ? 0.0 : 1.0 )
#define ssLarger( A, B )         ( ( A > B ) ? 1.0 : 0.0 )
#define ssLargerOrEqual( A, B )  ( ( A >= B ) ? 1.0 : 0.0 )
#define ssSmaller( A,  B ) 		 ( ( A < B ) ? 1.0 : 0.0 )
#define ssSmallerOrEqual( A, B ) ( ( A <= B ) ? 1.0 : 0.0 )
#define ssNot( A ) 		         ( ( A * 1.0 != 0.0 ) ? 0.0 : 1.0 )

int ssIntMod( int x, int y ) { return x - y * ( x / y ); }

#define ssPRECISION_LIMITER( Value ) Value = floor( Value * 10000.0 ) * 0.0001;
#define ssPRECISION_LIMITER2( Value ) Value = floor( Value * 2000.0 + 0.5 ) * 0.0005;

#define ssDELTA_TIME_MIN 0.00

//--------------------------------------------------------

float ssSRGB_to_Linear( float value ) { return ( DEVICE_IS_FAST ) ? pow( value, 2.2 ) : value * value; }
vec2  ssSRGB_to_Linear( vec2  value ) { return ( DEVICE_IS_FAST ) ? vec2( pow( value.x, 2.2 ), pow( value.y, 2.2 ) ) : value * value; }
vec3  ssSRGB_to_Linear( vec3  value ) { return ( DEVICE_IS_FAST ) ? vec3( pow( value.x, 2.2 ), pow( value.y, 2.2 ), pow( value.z, 2.2 ) ) : value * value; }
vec4  ssSRGB_to_Linear( vec4  value ) { return ( DEVICE_IS_FAST ) ? vec4( pow( value.x, 2.2 ), pow( value.y, 2.2 ), pow( value.z, 2.2 ), pow( value.w, 2.2 ) ) : value * value; }

float ssLinear_to_SRGB( float value ) { return ( DEVICE_IS_FAST ) ? pow( value, 0.45454545 ) : sqrt( value ); }
vec2  ssLinear_to_SRGB( vec2  value ) { return ( DEVICE_IS_FAST ) ? vec2( pow( value.x, 0.45454545 ), pow( value.y, 0.45454545 ) ) : sqrt( value ); }
vec3  ssLinear_to_SRGB( vec3  value ) { return ( DEVICE_IS_FAST ) ? vec3( pow( value.x, 0.45454545 ), pow( value.y, 0.45454545 ), pow( value.z, 0.45454545 ) ) : sqrt( value ); }
vec4  ssLinear_to_SRGB( vec4  value ) { return ( DEVICE_IS_FAST ) ? vec4( pow( value.x, 0.45454545 ), pow( value.y, 0.45454545 ), pow( value.z, 0.45454545 ), pow( value.w, 0.45454545 ) ) : sqrt( value ); }

//--------------------------------------------------------

float3 ssWorldToNDC( float3 posWS, mat4 ViewProjectionMatrix )
{
	float4 ScreenVector = ViewProjectionMatrix * float4( posWS, 1.0 );
	return ScreenVector.xyz / ScreenVector.w;
}

//-------------------

float  Dummy1;
float2 Dummy2;
float3 Dummy3;
float4 Dummy4;


int ssInstanceID;

// When calling matrices in NGS, please use the global functions defined in the Matrix node
// This ensures their respective flags are set correctly for VFX, eg. ngsViewMatrix --> ssGetGlobal_Matrix_View()
#define ngsLocalAabbMin						sc_LocalAabbMin
#define ngsWorldAabbMin						sc_WorldAabbMin
#define ngsLocalAabbMax						sc_LocalAabbMax
#define ngsWorldAabbMax						sc_WorldAabbMax
#define ngsCameraAspect 					sc_Camera.aspect;
#define ngsCameraNear                       sc_Camera.clipPlanes.x
#define ngsCameraFar                        sc_Camera.clipPlanes.y
#define ngsCameraPosition                   sc_Camera.position
#define ngsModelMatrix                      sc_ModelMatrix							//ssGetGlobal_Matrix_World()
#define ngsPrevFrameModelMatrix             sc_PrevFrameModelMatrix					//ssGetGlobal_Matrix_PrevFrameWorld()
#define ngsModelMatrixInverse               sc_ModelMatrixInverse					//ssGetGlobal_Matrix_World_Inverse()
#define ngsModelViewMatrix                  sc_ModelViewMatrix						//ssGetGlobal_Matrix_World_View()
#define ngsModelViewMatrixInverse           sc_ModelViewMatrixInverse				//ssGetGlobal_Matrix_World_View_Inverse()
#define ngsProjectionMatrix                 sc_ProjectionMatrix						//ssGetGlobal_Matrix_World_View_Projection()
#define ngsProjectionMatrixInverse          sc_ProjectionMatrixInverse				//ssGetGlobal_Matrix_World_View_Projection_Inverse()
#define ngsModelViewProjectionMatrix        sc_ModelViewProjectionMatrix			//ssGetGlobal_Matrix_Projection()
#define ngsModelViewProjectionMatrixInverse sc_ModelViewProjectionMatrixInverse		//ssGetGlobal_Matrix_Projection_Inverse()
#define ngsViewMatrix                       sc_ViewMatrix							//ssGetGlobal_Matrix_View()
#define ngsViewMatrixInverse                sc_ViewMatrixInverse					//ssGetGlobal_Matrix_View_Inverse()
#define ngsViewProjectionMatrix             sc_ViewProjectionMatrix					//ssGetGlobal_Matrix_View_Projection()
#define ngsViewProjectionMatrixInverse      sc_ViewProjectionMatrixInverse			//ssGetGlobal_Matrix_View_Projection_Inverse()
#define ngsCameraUp 					    sc_ViewMatrixInverse[1].xyz
#define ngsCameraForward                    -sc_ViewMatrixInverse[2].xyz
#define ngsCameraRight                      sc_ViewMatrixInverse[0].xyz
#define ngsFrame 		                    0

//--------------------------------------------------------


#if defined( STUDIO )

struct ssPreviewInfo
{
	float4 Color;
	bool   Saved;
};

ssPreviewInfo PreviewInfo;

uniform NF_PRECISION int PreviewEnabled; // PreviewEnabled is set to 1 by the renderer when Lens Studio is rendering node previews
uniform NF_PRECISION int PreviewNodeID;  // PreviewNodeID is set to the node's ID that a preview is being rendered for

varying float4 PreviewVertexColor;
varying float  PreviewVertexSaved;

#define NF_DISABLE_VERTEX_CHANGES()					( PreviewEnabled == 1 )			
#define NF_SETUP_PREVIEW_VERTEX()					PreviewInfo.Color = PreviewVertexColor = float4( 0.5 ); PreviewInfo.Saved = false; PreviewVertexSaved = 0.0;
#define NF_SETUP_PREVIEW_PIXEL()					PreviewInfo.Color = PreviewVertexColor; PreviewInfo.Saved = ( PreviewVertexSaved * 1.0 != 0.0 ) ? true : false;
#define NF_PREVIEW_SAVE( xCode, xNodeID, xAlpha ) 	if ( PreviewEnabled == 1 && !PreviewInfo.Saved && xNodeID == PreviewNodeID ) { PreviewInfo.Saved = true; { PreviewInfo.Color = xCode; if ( !xAlpha ) PreviewInfo.Color.a = 1.0; } }
#define NF_PREVIEW_FORCE_SAVE( xCode ) 				if ( PreviewEnabled == 0 ) { PreviewInfo.Saved = true; { PreviewInfo.Color = xCode; } }
#define NF_PREVIEW_OUTPUT_VERTEX()					if ( PreviewInfo.Saved ) { PreviewVertexColor = float4( PreviewInfo.Color.rgb, 1.0 ); PreviewVertexSaved = 1.0; }
#define NF_PREVIEW_OUTPUT_PIXEL()					if ( PreviewEnabled == 1 ) { if ( PreviewInfo.Saved ) { FinalColor = float4( PreviewInfo.Color ); } else { FinalColor = vec4( 0.0, 0.0, 0.0, 0.0 ); /*FinalColor.a = 1.0;*/ /* this will be an option later */ }  }

#else

#define NF_DISABLE_VERTEX_CHANGES()					false			
#define NF_SETUP_PREVIEW_VERTEX()
#define NF_SETUP_PREVIEW_PIXEL()
#define NF_PREVIEW_SAVE( xCode, xNodeID, xAlpha )
#define NF_PREVIEW_FORCE_SAVE( xCode )
#define NF_PREVIEW_OUTPUT_VERTEX()
#define NF_PREVIEW_OUTPUT_PIXEL()

#endif


//--------------------------------------------------------



//--------------------------------------------------------

#ifdef VERTEX_SHADER

//--------------------------------------------------------

in vec4 color;

//--------------------------------------------------------

void ngsVertexShaderBegin( out sc_Vertex_t v )
{
	v = sc_LoadVertexAttributes();
	
	if ( sc_Voxelization )
	{
		processVoxelizationBeginVS(v);
	}
	
	
	ssInstanceID = sc_LocalInstanceID;
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	
	sc_BlendVertex(v);
	sc_SkinVertex(v);
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	if ( sc_RenderingSpace == SC_RENDERING_SPACE_SCREEN )
	{
		varPos         = vec3( 0.0 );
		varNormal      = v.normal;
		varTangent.xyz = v.tangent;
	}
	else if ( sc_RenderingSpace == SC_RENDERING_SPACE_SCREEN_MV )
	{
		varPos         = vec3( 0.0 );
		varNormal      = v.normal;
		varTangent.xyz = v.tangent;
	}
	else if ( sc_RenderingSpace == SC_RENDERING_SPACE_WORLD )
	{				
		varPos         = v.position.xyz;
		varNormal      = v.normal;
		varTangent.xyz = v.tangent;
	}
	else if ( sc_RenderingSpace == SC_RENDERING_SPACE_OBJECT )
	{
		varPos         = (sc_ModelMatrix * v.position).xyz;
		varNormal      = sc_NormalMatrix * v.normal;
		varTangent.xyz = sc_NormalMatrix * v.tangent;
	}
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	#if !defined(MOBILE)
	if ( PreviewEnabled == 1 )
	v.texture0.x = 1.0 - v.texture0.x; // fix to flip the preview quad UVs horizontally
	#endif
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	varColor = color;
}			

//--------------------------------------------------------

void ngsVertexShaderEnd( inout sc_Vertex_t v, vec3 WorldPosition, vec3 WorldNormal, vec3 WorldTangent, vec4 ScreenPosition )
{
	varPos          = WorldPosition; 
	varNormal       = normalize( WorldNormal );
	varTangent.xyz  = normalize( WorldTangent );
	varTangent.w    = tangent.w;
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	if ( bool( UseViewSpaceDepthVariant ) && ( bool( sc_OITDepthGatherPass ) || bool( sc_OITCompositingPass ) || bool( sc_OITDepthBoundsPass ) ) )
	{
		varViewSpaceDepth = -sc_ObjectToView( v.position ).z;
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	float4 screenPosition = float4( 0.0 );
	
	if ( sc_RenderingSpace == SC_RENDERING_SPACE_SCREEN )
	{
		screenPosition = ScreenPosition; 
	}
	else if ( sc_RenderingSpace == SC_RENDERING_SPACE_SCREEN_MV )
	{
		screenPosition = ( ngsModelViewMatrix * v.position ) * vec4( 1.0 / sc_Camera.aspect, 1.0, 1.0, 1.0 );
	}
	else if ( sc_RenderingSpace == SC_RENDERING_SPACE_WORLD )
	{
		screenPosition = ngsViewProjectionMatrix * float4( varPos.xyz, 1.0 );
	}
	else if ( sc_RenderingSpace == SC_RENDERING_SPACE_OBJECT )
	{
		screenPosition = ngsViewProjectionMatrix * float4( varPos.xyz, 1.0 );
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	varTex01 = vec4( v.texture0, v.texture1 );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	if ( bool( sc_ProjectiveShadowsReceiver ) )
	{
		varShadowTex = getProjectedTexCoords(v.position);
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	screenPosition = applyDepthAlgorithm(screenPosition); 
	screenPosition = sc_ApplyTAAJitter(screenPosition); 
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	sc_SetClipPosition( screenPosition );
	if ( sc_Voxelization )
	{
		processVoxelizationEndVS(v);
		
	}
	else if ( sc_OutputBounds )
	{
		processOutputDepthBoundsVS(v);
	}
}

//--------------------------------------------------------

#endif //VERTEX_SHADER

//--------------------------------------------------------

float3 ssGetScreenPositionNDC( float4 vertexPosition, float3 positionWS, mat4 viewProjectionMatrix )
{
	float3 screenPosition = vec3( 0.0 );
	
	#ifdef VERTEX_SHADER
	
	if ( sc_RenderingSpace == SC_RENDERING_SPACE_SCREEN )
	{
		screenPosition = vertexPosition.xyz;
	}
	else
	{
		screenPosition = ssWorldToNDC( positionWS, viewProjectionMatrix );
	}
	
	#endif
	
	return screenPosition;
}

//--------------------------------------------------------

uniform NF_PRECISION float alphaTestThreshold;

#ifdef FRAGMENT_SHADER

void ngsAlphaTest( float opacity )
{
	if ( sc_BlendMode_AlphaTest )
	{
		if ( opacity < alphaTestThreshold )
		{
			discard;
		}
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	if ( ENABLE_STIPPLE_PATTERN_TEST )
	{
		vec2  localCoord = floor(mod(sc_GetGlFragCoord().xy, vec2(4.0)));
		float threshold  = (mod(dot(localCoord, vec2(4.0, 1.0)) * 9.0, 16.0) + 1.0) / 17.0;
		
		if ( opacity < threshold )
		{
			discard;
		}
	}
}

#endif // #ifdef FRAGMENT_SHADER

#ifdef FRAGMENT_SHADER

vec4 ngsPixelShader( vec4 result ) 
{	
	if ( sc_ProjectiveShadowsCaster )
	{
		result = evaluateShadowCasterColor( result );
	}
	else if ( sc_RenderAlphaToColor )
	{
		result = vec4(result.a);
	}
	else if ( sc_BlendMode_Custom )
	{
		result = applyCustomBlend(result);
	}
	else if ( sc_Voxelization )
	{
		result = processVoxelizationFS(result);
		
	}
	else if ( sc_OutputBounds )
	{
		result = processOutputBoundsFS(result);
		
	}
	else
	{
		result = sc_ApplyBlendModeModifications(result);
	}
	
	return result;
}

#endif


//-----------------------------------------------------------------------


// Material Parameters ( Tweaks )

uniform NF_PRECISION                      float2        size; // Title: Size
uniform NF_PRECISION                      float         cornerRadius; // Title: Corner Radius
SC_DECLARE_TEXTURE(backgroundTexture); // Title:        Background Texture
uniform NF_PRECISION                      float         useTexture; // Title: useTexture
uniform NF_PRECISION                      float2        textureMode; // Title: Texture Mode
uniform NF_PRECISION                      float         textureWrap; // Title: Texture Wrap
uniform NF_PRECISION                      float4        backgroundColor; // Title: Background Color
uniform NF_PRECISION                      float4        colors[6]; // Title: Colors
uniform NF_PRECISION                      float         percents[6]; // Title: Percents
uniform NF_PRECISION                      int           stops; // Title: Stops
uniform NF_PRECISION                      float         linearGradientStart; // Title: Linear Gradient Start
uniform NF_PRECISION                      float         linearGradientEnd; // Title: Linear Gradient End
uniform NF_PRECISION                      float         linearGradientAngle; // Title: Linear Gradient Angle
uniform NF_PRECISION                      float         linearGradientLength; // Title: Linear Gradient Length
uniform NF_PRECISION                      float2        gradientStartPosition; // Title: Gradient Start Position
uniform NF_PRECISION                      float         radialGradientLength; // Title: Radial Gradient Length
uniform NF_PRECISION                      float         border; // Title: Border
uniform NF_PRECISION                      float         borderSize; // Title: Border Size
uniform NF_PRECISION                      float         gradientType; // Title: Gradient Type
uniform NF_PRECISION                      float4        highlightColorStop2; // Title: Highlight Color Stop 2
uniform NF_PRECISION                      float4        highlightColorStop1; // Title: Highlight Color Stop 1
uniform NF_PRECISION                      float         highlightStop1; // Title: highlightStop1
uniform NF_PRECISION                      float         highlightStop2; // Title: highlightStop2
uniform NF_PRECISION                      float2        cursorPosition; // Title: cursorPostion
uniform NF_PRECISION                      float         highlightSize; // Title: highlightSize
uniform NF_PRECISION                      float4        highlightActiveColorStop2; // Title: Highlight Active Color Stop 2
uniform NF_PRECISION                      float4        highlightActiveColorStop1; // Title: Highlight Active Color Stop 1
uniform NF_PRECISION                      float         isActive; // Title: isActive
uniform NF_PRECISION                      float         isHovered; // Title: Is Hovered
SC_DECLARE_TEXTURE(circleTexture); //     Title:        circleTexture
uniform bool                              borderOnly;   // Title: borderOnly
uniform bool                              cutOutCenter; // Title: cutOutCenter
uniform NF_PRECISION                      float         frameBorder; // Title: margin
uniform NF_PRECISION                      float4        grabZones[8]; // Title: Grab Zones
uniform NF_PRECISION                      float         grabZonesCount; // Title: Grab Zones Count
uniform NF_PRECISION                      float         dotsHighlightStop1; // Title: dotsHighlightStop1
uniform NF_PRECISION                      float         dotsHighlightStop2; // Title: dotsHighlightStop2
uniform NF_PRECISION                      float         dotsScalar; // Title: Dot Scalar
uniform NF_PRECISION                      float4        borderColor; // Title: Border Color
uniform NF_PRECISION                      float4        borderGradientColors[6]; // Title: Border Gradient Colors
uniform NF_PRECISION                      float         borderGradientPercents[6]; // Title: Border Gradient Percents
uniform NF_PRECISION                      int           borderGradientStops; // Title: Border Gradient Stops
uniform NF_PRECISION                      float         borderLinearGradientStart; // Title: Border Linear Gradient Start
uniform NF_PRECISION                      float         borderLinearGradientEnd; // Title: Border Linear Gradient End
uniform NF_PRECISION                      float         borderLinearGradientAngle; // Title: Border Linear Gradient Angle
uniform NF_PRECISION                      float         borderLinearGradientLength; // Title: Border Linear Gradient Length
uniform NF_PRECISION                      float2        borderGradientStartPosition; // Title: Border Gradient Start Position
uniform NF_PRECISION                      float         borderRadialGradientLength; // Title: Border Radial Gradient Length
uniform NF_PRECISION                      float         borderGradientType; // Title: Border Gradient Type
uniform NF_PRECISION                      float         edgeHighlightStop1; // Title: edgeHighlightStop1
uniform NF_PRECISION                      float         edgeHighlightStop2; // Title: edgeHighlightStop2
uniform NF_PRECISION                      float         opacityFactor; // Title: Opacity Factor	


// Uniforms ( Ports )

#if defined( STUDIO )
uniform NF_PRECISION float Port_Input0_N008;
uniform NF_PRECISION float Port_Input1_N008;
uniform NF_PRECISION float2 Port_Import_N023;
uniform NF_PRECISION float Port_Import_N024;
uniform NF_PRECISION float Port_Input1_N032;
uniform NF_PRECISION float2 Port_Input1_N025;
uniform NF_PRECISION float Port_Input0_N010;
uniform NF_PRECISION float Port_Input0_N016;
uniform NF_PRECISION float Port_Input0_N017;
uniform NF_PRECISION float Port_Input0_N043;
uniform NF_PRECISION float Port_Input0_N069;
uniform NF_PRECISION float Port_Input1_N068;
uniform NF_PRECISION float Port_borderSoftness_N007;
uniform NF_PRECISION float Port_Input1_N105;
uniform NF_PRECISION float Port_Input1_N106;
uniform NF_PRECISION float Port_Input1_N122;
uniform NF_PRECISION float Port_Input1_N090;
uniform NF_PRECISION float Port_Input0_N119;
uniform NF_PRECISION float Port_Default_N117;
#endif	



//-----------------------------------------------------------------------



//-----------------------------------------------------------------------

#ifdef VERTEX_SHADER

//----------

// Globals

struct ssGlobals
{
	float gTimeElapsed;
	float gTimeDelta;
	float gTimeElapsedShifted;
	
	float4 VertexColor;
	float3 SurfacePosition_ObjectSpace;
};

ssGlobals tempGlobals;
#define scCustomCodeUniform	

//----------

// Functions

#define Node0_Surface_Color( Color, Globals ) Color = Globals.VertexColor
void Node1_Split_Vector( in float4 Value, out float Value1, out float Value2, out float Value3, out float Value4, ssGlobals Globals )
{ 
	Value1 = Value.r;
	Value2 = Value.g;
	Value3 = Value.b;
	Value4 = Value.a;
}
#define Node8_Smoothstep( Input0, Input1, Input2, Output, Globals ) Output = smoothstep( Input0, Input1, Input2 )
void Node36_Float_Parameter( out float2 Output, ssGlobals Globals ) { Output = size; }
#define Node23_Float_Import( Import, Value, Globals ) Value = Import
void Node37_Split_Vector( in float2 Value, out float Value1, out float Value2, ssGlobals Globals )
{ 
	Value1 = Value.x;
	Value2 = Value.y;
}
#define Node14_Construct_Vector( Value1, Value2, Value, Globals ) Value.x = Value1; Value.y = Value2
void Node33_Float_Parameter( out float Output, ssGlobals Globals ) { Output = cornerRadius; }
#define Node24_Float_Import( Import, Value, Globals ) Value = Import
#define Node35_Subtract_One( Input0, Output, Globals ) Output = Input0 - 1.0
#define Node32_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node34_Subtract( Input0, Input1, Output, Globals ) Output = Input0 - float2(Input1)
void Node15_Split_Vector( in float2 Value, out float Value1, out float Value2, ssGlobals Globals )
{ 
	Value1 = Value.x;
	Value2 = Value.y;
}
#define Node11_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node2_Surface_Position( Position, Globals ) Position = Globals.SurfacePosition_ObjectSpace
void Node30_Split_Vector( in float3 Value, out float2 Value1, out float Value2, ssGlobals Globals )
{ 
	Value1 = Value.xy;
	Value2 = Value.z;
}
#define Node20_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * float2(Input1)
#define Node25_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node27_Subtract( Input0, Input1, Output, Globals ) Output = Input0 - Input1
#define Node29_Construct_Vector( Value1, Value2, Value, Globals ) Value.xy = Value1; Value.z = Value2
void Node3_Split_Vector( in float3 Value, out float Value1, out float Value2, out float Value3, ssGlobals Globals )
{ 
	Value1 = Value.x;
	Value2 = Value.y;
	Value3 = Value.z;
}
#define Node12_Add( Input0, Input1, Output, Globals ) Output = Input0 + Input1
#define Node10_Step( Input0, Input1, Output, Globals ) Output = step( Input0, Input1 )
#define Node6_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node9_Add( Input0, Input1, Output, Globals ) Output = Input0 + Input1
#define Node5_Construct_Vector( Value1, Value2, Value3, Value, Globals ) Value.x = Value1; Value.y = Value2; Value.z = Value3
#define Node28_Transform_Vector( VectorIn, VectorOut, Globals ) VectorOut = ( ngsModelMatrix * float4( VectorIn.xyz, 1.0 ) ).xyz
#define Node39_Float_Export( Value, Export, Globals ) Export = Value

//-----------------------------------------------------------------------

void main() 
{
	
	
	NF_SETUP_PREVIEW_VERTEX()
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	sc_Vertex_t v;
	ngsVertexShaderBegin( v );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	ssGlobals Globals;	
	Globals.gTimeElapsed = sc_TimeElapsed;
	Globals.gTimeDelta   = sc_TimeDelta;
	Globals.VertexColor                 = varColor;
	Globals.SurfacePosition_ObjectSpace = ( ngsModelMatrixInverse * float4( varPos, 1.0 ) ).xyz;
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	float4 ScreenPosition = vec4( 0.0 );
	float3 WorldPosition  = varPos;
	float3 WorldNormal    = varNormal;
	float3 WorldTangent   = varTangent.xyz;
	float3 PrevWorldPosition  = vec3(0);
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	/* Input port: 'WorldPosition'  */
	
	{
		float4 Color_N0 = float4(0.0); Node0_Surface_Color( Color_N0, Globals );
		float Value1_N1 = 0.0; float Value2_N1 = 0.0; float Value3_N1 = 0.0; float Value4_N1 = 0.0; Node1_Split_Vector( Color_N0, Value1_N1, Value2_N1, Value3_N1, Value4_N1, Globals );
		float Output_N8 = 0.0; Node8_Smoothstep( NF_PORT_CONSTANT( float( 0.5 ), Port_Input0_N008 ), NF_PORT_CONSTANT( float( 0.5 ), Port_Input1_N008 ), Value3_N1, Output_N8, Globals );
		float2 Output_N36 = float2(0.0); Node36_Float_Parameter( Output_N36, Globals );
		float2 Value_N23 = float2(0.0); Node23_Float_Import( Output_N36, Value_N23, Globals );
		float Value1_N37 = 0.0; float Value2_N37 = 0.0; Node37_Split_Vector( Value_N23, Value1_N37, Value2_N37, Globals );
		float2 Value_N14 = float2(0.0); Node14_Construct_Vector( Value1_N37, Value2_N37, Value_N14, Globals );
		float Output_N33 = 0.0; Node33_Float_Parameter( Output_N33, Globals );
		float Value_N24 = 0.0; Node24_Float_Import( Output_N33, Value_N24, Globals );
		float Output_N35 = 0.0; Node35_Subtract_One( Value_N24, Output_N35, Globals );
		float Output_N32 = 0.0; Node32_Multiply( Output_N35, NF_PORT_CONSTANT( float( 2.0 ), Port_Input1_N032 ), Output_N32, Globals );
		float2 Output_N34 = float2(0.0); Node34_Subtract( Value_N14, Output_N32, Output_N34, Globals );
		float Value1_N15 = 0.0; float Value2_N15 = 0.0; Node15_Split_Vector( Output_N34, Value1_N15, Value2_N15, Globals );
		float Output_N11 = 0.0; Node11_Multiply( Output_N8, Value1_N15, Output_N11, Globals );
		float3 Position_N2 = float3(0.0); Node2_Surface_Position( Position_N2, Globals );
		float2 Value1_N30 = float2(0.0); float Value2_N30 = 0.0; Node30_Split_Vector( Position_N2, Value1_N30, Value2_N30, Globals );
		float2 Output_N20 = float2(0.0); Node20_Multiply( Value1_N30, Value_N24, Output_N20, Globals );
		float2 Output_N25 = float2(0.0); Node25_Multiply( Output_N34, NF_PORT_CONSTANT( float2( 0.5, 0.5 ), Port_Input1_N025 ), Output_N25, Globals );
		float2 Output_N27 = float2(0.0); Node27_Subtract( Output_N20, Output_N25, Output_N27, Globals );
		float3 Value_N29 = float3(0.0); Node29_Construct_Vector( Output_N27, Value2_N30, Value_N29, Globals );
		float Value1_N3 = 0.0; float Value2_N3 = 0.0; float Value3_N3 = 0.0; Node3_Split_Vector( Value_N29, Value1_N3, Value2_N3, Value3_N3, Globals );
		float Output_N12 = 0.0; Node12_Add( Output_N11, Value1_N3, Output_N12, Globals );
		float Output_N10 = 0.0; Node10_Step( NF_PORT_CONSTANT( float( 1.0 ), Port_Input0_N010 ), Value1_N1, Output_N10, Globals );
		float Output_N6 = 0.0; Node6_Multiply( Output_N10, Value2_N15, Output_N6, Globals );
		float Output_N9 = 0.0; Node9_Add( Output_N6, Value2_N3, Output_N9, Globals );
		float3 Value_N5 = float3(0.0); Node5_Construct_Vector( Output_N12, Output_N9, Value3_N3, Value_N5, Globals );
		float3 VectorOut_N28 = float3(0.0); Node28_Transform_Vector( Value_N5, VectorOut_N28, Globals );
		float3 Export_N39 = float3(0.0); Node39_Float_Export( VectorOut_N28, Export_N39, Globals );
		
		WorldPosition = Export_N39;
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	if ( NF_DISABLE_VERTEX_CHANGES() )
	{
		WorldPosition  = varPos;
		WorldNormal    = varNormal;
		WorldTangent   = varTangent.xyz;
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	ngsVertexShaderEnd( v, WorldPosition, WorldNormal, WorldTangent, v.position );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	
	
	sc_ComputeMotionVectorIfNeeded(varPos);
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	NF_PREVIEW_OUTPUT_VERTEX()
}

//-----------------------------------------------------------------------

#endif // #ifdef VERTEX_SHADER

//-----------------------------------------------------------------------

#ifdef FRAGMENT_SHADER

//-----------------------------------------------------------------------------

//----------

// Globals

struct ssGlobals
{
	float gTimeElapsed;
	float gTimeDelta;
	float gTimeElapsedShifted;
	
	float3 SurfacePosition_ObjectSpace;
};

ssGlobals tempGlobals;
#define scCustomCodeUniform	

//----------

// Functions

vec4 N46_colors_sample( int index ) { vec4 _result_memfunc = vec4( 0.0 ); _result_memfunc = colors[ clamp( index, 0, 5 ) ]; return _result_memfunc; }
float N46_percents_sample( int index ) { float _result_memfunc = float( 0.0 ); _result_memfunc = percents[ clamp( index, 0, 5 ) ]; return _result_memfunc; }
int N46_stops;
int N46_type;
vec2 N46_uv;
vec4 N46_backgroundColor;

float N46_linearGradientStart;
float N46_linearGradientEnd;
float N46_linearGradientAngle;
float N46_linearGradientLength;
vec2 N46_gradientStartPosition;
float N46_radialGradientLength;
float N46_rectDist;

vec4 N46_OutColor; 

#pragma inline 
void N46_main()
{
	if( N46_stops > 0 ) {
		// use gradient
		if( N46_type == 0 ) {
			// linear gradient 
			float uvX = N46_uv.x * cos(-N46_linearGradientAngle) - N46_uv.y * sin(-N46_linearGradientAngle);
			N46_OutColor = N46_colors_sample(0);
			N46_OutColor = mix(N46_OutColor, N46_colors_sample(1), smoothstep(
					N46_linearGradientStart + N46_percents_sample(0) * N46_linearGradientLength,
					N46_linearGradientStart + N46_percents_sample(1) * N46_linearGradientLength,
					uvX
				));
			if( N46_stops > 2 ) {
				for (int i = 1; i < N46_stops - 1; i++) {
					N46_OutColor = mix(N46_OutColor, N46_colors_sample(i + 1), smoothstep(
							N46_linearGradientStart + N46_percents_sample(i) * N46_linearGradientLength,
							N46_linearGradientStart + N46_percents_sample(i + 1) * N46_linearGradientLength,
							uvX
						));
				}	
			}
		} else if( N46_type == 1 ) {
			// radial gradient
			float radLength = distance( N46_uv, N46_gradientStartPosition ) / N46_radialGradientLength * .5;
			N46_OutColor = N46_colors_sample(0);
			N46_OutColor = mix(N46_OutColor, N46_colors_sample(1), smoothstep( 
					N46_percents_sample(0),
					N46_percents_sample(1),
					radLength
				));
			if( N46_stops > 2 ) {
				for (int i = 1; i < N46_stops - 1; i++) {
					N46_OutColor = mix(N46_OutColor, N46_colors_sample(i + 1), smoothstep( 
							N46_percents_sample(i),
							N46_percents_sample(i + 1),
							radLength
						));
				}	
			}
		} else if( N46_type == 2 ) { 
			float borderGrad = 1. - N46_rectDist * -1.;
			N46_OutColor = N46_colors_sample(0);
			N46_OutColor = mix(N46_OutColor, N46_colors_sample(1), smoothstep( 
					N46_percents_sample(0),
					N46_percents_sample(1),
					borderGrad
				));
			if( N46_stops > 2 ) {
				for (int i = 1; i < N46_stops - 1; i++) {
					N46_OutColor = mix(N46_OutColor, N46_colors_sample(i + 1), smoothstep( 
							N46_percents_sample(i),
							N46_percents_sample(i + 1),
							borderGrad
						));
				}	
			}
		}
	} else {
		N46_OutColor = N46_backgroundColor;
	}
}
#define Node13_Surface_Position( Position, Globals ) Position = Globals.SurfacePosition_ObjectSpace
void Node36_Float_Parameter( out float2 Output, ssGlobals Globals ) { Output = size; }
#define Node23_Float_Import( Import, Value, Globals ) Value = Import
void Node37_Split_Vector( in float2 Value, out float Value1, out float Value2, ssGlobals Globals )
{ 
	Value1 = Value.x;
	Value2 = Value.y;
}
#define Node14_Construct_Vector( Value1, Value2, Value, Globals ) Value.x = Value1; Value.y = Value2
void Node33_Float_Parameter( out float Output, ssGlobals Globals ) { Output = cornerRadius; }
#define Node24_Float_Import( Import, Value, Globals ) Value = Import
#define Node35_Subtract_One( Input0, Output, Globals ) Output = Input0 - 1.0
#define Node32_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node34_Subtract( Input0, Input1, Output, Globals ) Output = Input0 - float2(Input1)
#define Node25_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node31_Add( Input0, Input1, Output, Globals ) Output = Input0 + Input1
void Node15_Split_Vector( in float2 Value, out float Value1, out float Value2, ssGlobals Globals )
{ 
	Value1 = Value.x;
	Value2 = Value.y;
}
#define Node16_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node17_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node19_Construct_Vector( Value1, Value2, Value, Globals ) Value.x = Value1; Value.y = Value2
#define Node18_Add( Input0, Input1, Output, Globals ) Output = Input0 + Input1
#define Node26_Add( Input0, Input1, Output, Globals ) Output = Input0 + float2(Input1)
#define Node22_Divide( Input0, Input1, Output, Globals ) Output = Input0 / (Input1 + 1.234e-6)
#define Node38_Float_Export( Value, Export, Globals ) Export = Value
vec4 N80_backgroundTexture_sample( vec2 coords ) { vec4 _result_memfunc = vec4( 0.0 ); _result_memfunc = SC_SAMPLE_TEX_R(backgroundTexture, coords, 0.0); return _result_memfunc; }
int N80_textureWrap;
float N80_useTexture;
vec2 N80_textureMode;

vec2 N80_uv;

vec4 N80_backgroundColor;

vec4 N80_outColor; 

#pragma inline 
void N80_main()
{
	if( N80_useTexture < 1. ) {
		N80_outColor = N80_backgroundColor;
	} else {
		vec2 tUv = N80_uv * .5;
		tUv *= N80_textureMode;
		tUv += .5;
		if(N80_textureWrap == 0) { 
			float outside = max( step( 1., tUv.x ), step( 1., tUv.y ) );
			outside = max ( outside, step( tUv.x, 0. ) );
			outside = max( outside, step( tUv.y, 0. ) );
			N80_outColor = mix( N80_backgroundTexture_sample(tUv), N80_backgroundColor, outside );
		} else if (N80_textureWrap == 2) {
			tUv.x = max(0., tUv.x);
			tUv.x = min(1., tUv.x);
			tUv.y = max(0., tUv.y);
			tUv.y = min(1., tUv.y);
			N80_outColor = N80_backgroundTexture_sample(tUv);
		} else {
			N80_outColor = N80_backgroundTexture_sample(tUv);
		}
		
	} 
	
	
}
void Node72_Texture_2D_Object_Parameter( out float2 TextureSize, out float2 PixelSize, ssGlobals Globals )
{ 
	/*nothing*/ TextureSize = backgroundTextureSize.xy;
	PixelSize = backgroundTextureSize.zw;
}
void Node77_Float_Parameter( out float Output, ssGlobals Globals ) { Output = useTexture; }
void Node79_Float_Parameter( out float2 Output, ssGlobals Globals ) { Output = textureMode; }
void Node73_Float_Parameter( out float Output, ssGlobals Globals ) { Output = textureWrap; }
void Node40_Float_Parameter( out float4 Output, ssGlobals Globals ) { Output = backgroundColor; }
void Node80_Background( in float useTexture, in float2 textureMode, in float textureWrap, in float2 uv, in float4 backgroundColor, out float4 outColor, ssGlobals Globals )
{ 
	tempGlobals = Globals;
	
	outColor = vec4( 0.0 );
	
	
	N80_useTexture = useTexture;
	N80_textureMode = textureMode;
	N80_textureWrap = int( textureWrap );
	N80_uv = uv;
	N80_backgroundColor = backgroundColor;
	
	N80_main();
	
	outColor = N80_outColor;
}
#define Node52_Float_Array_Object_Parameter( SizeOut, Globals ) /*nothing*/
#define Node47_Float_Array_Object_Parameter( SizeOut, Globals ) /*nothing*/
void Node45_Int_Parameter( out float Output, ssGlobals Globals ) { Output = float(stops); }
void Node48_Float_Parameter( out float Output, ssGlobals Globals ) { Output = linearGradientStart; }
void Node49_Float_Parameter( out float Output, ssGlobals Globals ) { Output = linearGradientEnd; }
void Node50_Float_Parameter( out float Output, ssGlobals Globals ) { Output = linearGradientAngle; }
void Node51_Float_Parameter( out float Output, ssGlobals Globals ) { Output = linearGradientLength; }
void Node53_Float_Parameter( out float2 Output, ssGlobals Globals ) { Output = gradientStartPosition; }
void Node55_Float_Parameter( out float Output, ssGlobals Globals ) { Output = radialGradientLength; }
int N7_useBorder;
float N7_radius;
float N7_borderSize;
float N7_borderSoftness;
vec2 N7_position;
vec2 N7_scale;
float N7_dist;
float N7_rawDist;

float N7_saturate( float t ) {
	return clamp( t, 0., 1. );
}

float N7_roundedBox(vec2 pos, vec2 size) {
	return length(max(abs(pos)-size+N7_radius+N7_borderSize-2.+N7_borderSoftness,0.0))-N7_radius;
}

#pragma inline 
void N7_main()
{
	
	if(N7_useBorder == 1) {
		vec2 halfSize = N7_scale;
		vec2 pos = N7_position * ( N7_scale + 2. );
		N7_dist = N7_roundedBox(pos, halfSize);
		N7_rawDist = N7_dist;
		N7_dist = smoothstep(0.0, N7_borderSoftness * 2.0, N7_dist );
		if( N7_borderSize == 0. ) {
			N7_dist = 0.;
		}
	} else {
		N7_dist = 0.;
		N7_rawDist = 0.;
	}
	
	
}
void Node71_Float_Parameter( out float Output, ssGlobals Globals ) { Output = border; }
#define Node43_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
void Node42_Float_Parameter( out float Output, ssGlobals Globals ) { Output = borderSize; }
#define Node69_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node44_Subtract( Input0, Input1, Output, Globals ) Output = Input0 - Input1
#define Node68_Max( Input0, Input1, Output, Globals ) Output = max( Input0, Input1 )
void Node7_Stroke( in float useBorder, in float radius, in float borderSize, in float borderSoftness, in float2 position, in float2 scale, out float dist, out float rawDist, ssGlobals Globals )
{ 
	tempGlobals = Globals;
	
	dist = float( 0.0 );
	rawDist = float( 0.0 );
	
	
	N7_useBorder = int( useBorder );
	N7_radius = radius;
	N7_borderSize = borderSize;
	N7_borderSoftness = borderSoftness;
	N7_position = position;
	N7_scale = scale;
	
	N7_main();
	
	dist = N7_dist;
	rawDist = N7_rawDist;
}
void Node54_Float_Parameter( out float Output, ssGlobals Globals ) { Output = gradientType; }
void Node46_Gradient( in float2 uv, in float4 backgroundColor, in float stops, in float linearGradientStart, in float linearGradientEnd, in float linearGradientAngle, in float linearGradientLength, in float2 gradientStartPosition, in float radialGradientLength, in float rectDist, in float type, out float4 OutColor, ssGlobals Globals )
{ 
	tempGlobals = Globals;
	
	OutColor = vec4( 0.0 );
	
	
	N46_uv = uv;
	N46_backgroundColor = backgroundColor;
	N46_stops = int( stops );
	N46_linearGradientStart = linearGradientStart;
	N46_linearGradientEnd = linearGradientEnd;
	N46_linearGradientAngle = linearGradientAngle;
	N46_linearGradientLength = linearGradientLength;
	N46_gradientStartPosition = gradientStartPosition;
	N46_radialGradientLength = radialGradientLength;
	N46_rectDist = rectDist;
	N46_type = int( type );
	
	N46_main();
	
	OutColor = N46_OutColor;
}
void Node123_Float_Parameter( out float4 Output, ssGlobals Globals ) { Output = highlightColorStop2; }
void Node124_Float_Parameter( out float4 Output, ssGlobals Globals ) { Output = highlightColorStop1; }
void Node107_Float_Parameter( out float Output, ssGlobals Globals ) { Output = highlightStop1; }
void Node108_Float_Parameter( out float Output, ssGlobals Globals ) { Output = highlightStop2; }
void Node85_Float_Parameter( out float2 Output, ssGlobals Globals ) { Output = cursorPosition; }
#define Node87_Subtract( Input0, Input1, Output, Globals ) Output = Input0 - Input1
void Node97_Float_Parameter( out float Output, ssGlobals Globals ) { Output = highlightSize; }
#define Node105_Add( Input0, Input1, Output, Globals ) Output = Input0 + Input1
#define Node106_Max( Input0, Input1, Output, Globals ) Output = max( Input0, Input1 )
#define Node94_Divide( Input0, Input1, Output, Globals ) Output = Input0 / (float2(Input1) + 1.234e-6)
#define Node95_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node86_Length( Input0, Output, Globals ) Output = length( Input0 )
#define Node93_Smoothstep( Input0, Input1, Input2, Output, Globals ) Output = smoothstep( Input0, Input1, Input2 )
#define Node122_Pow( Input0, Input1, Output, Globals ) Output = ( Input0 <= 0.0 ) ? 0.0 : pow( Input0, Input1 )
#define Node125_Mix( Input0, Input1, Input2, Output, Globals ) Output = mix( Input0, Input1, float4(Input2) )
void Node121_Float_Parameter( out float4 Output, ssGlobals Globals ) { Output = highlightActiveColorStop2; }
void Node96_Float_Parameter( out float4 Output, ssGlobals Globals ) { Output = highlightActiveColorStop1; }
#define Node120_Mix( Input0, Input1, Input2, Output, Globals ) Output = mix( Input0, Input1, float4(Input2) )
void Node103_Float_Parameter( out float Output, ssGlobals Globals ) { Output = isActive; }
#define Node84_Mix( Input0, Input1, Input2, Output, Globals ) Output = mix( Input0, Input1, float4(Input2) )
void Node98_Float_Parameter( out float Output, ssGlobals Globals ) { Output = isHovered; }
#define Node100_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node91_Mix( Input0, Input1, Input2, Output, Globals ) Output = mix( Input0, Input1, float4(Input2) )
vec4 N81_circleTexture_sample( vec2 coords ) { vec4 _result_memfunc = vec4( 0.0 ); _result_memfunc = SC_SAMPLE_TEX_R(circleTexture, coords, 0.0); return _result_memfunc; }
bool N81_borderOnly;
vec2 N81_uv;
vec2 N81_size;
float N81_cursorLength;
float N81_isHovered;
float N81_isCenter;
float N81_isZone;
float N81_dotsStop1;
float N81_dotsStop2;

float N81_circleScalar;

float N81_circle; 

const float N81_feather = 3.;
const float N81_margin = 5.;

// Saturate function - clamps value between 0.0 and 1.0
float N81_saturate(float x) {
	return clamp(x, 0.0, 1.0);
}

vec2 N81_saturate(vec2 x) {
	return clamp(x, 0.0, 1.0);
}

vec3 N81_saturate(vec3 x) {
	return clamp(x, 0.0, 1.0);
}

vec4 N81_saturate(vec4 x) {
	return clamp(x, 0.0, 1.0);
}

//const float N81_circleScalar = .8;
//const float N81_circleScalar = 1.2;

#pragma inline 
void N81_main()
{
	N81_circle = 0.;
	float drawCircle = 1.;
	// early exit
	if(N81_isHovered != 0. || N81_isZone != 0.) {
		
		if( N81_borderOnly ) {
			
			drawCircle -= N81_isCenter;
			
		}
		
		vec2 circleUv = (N81_uv) * vec2(N81_circleScalar * N81_size.x, N81_circleScalar * N81_size.y);
		
		float dotAlpha = 0.;
		
		if( mod(circleUv.x, 2.) < 1. ) {
			if( mod( circleUv.y + 1., 2.) < 1. ) {
				float dotFadeIn = smoothstep( N81_dotsStop1, N81_dotsStop2, N81_cursorLength );
				dotFadeIn *= N81_isHovered;
				dotFadeIn += N81_isZone;
				dotAlpha = N81_saturate(smoothstep(0.0, .4, N81_circleTexture_sample(circleUv).a * dotFadeIn));
			}
		}
		
		N81_circle = dotAlpha * drawCircle;
	}
	
}
#define Node82_Texture_2D_Object_Parameter( Globals ) /*nothing*/
bool N114_borderOnly;
bool N114_cutOutCenter;
vec2 N114_uv;
vec2 N114_size;
float N114_margin;
float N114_isCenter; 

const float N114_feather = 1.;

float N114_centerArea(vec2 N114_uv, vec2 centerSize) {
	
	// turn off center if set to border only
	float N114_isCenter = smoothstep( centerSize.x * -.5 - N114_feather, centerSize.x * -.5 + N114_feather, N114_uv.x );
	N114_isCenter *= smoothstep( centerSize.x * .5 + N114_feather, centerSize.x * .5 - N114_feather, N114_uv.x );
	N114_isCenter *= smoothstep( centerSize.y * -.5 - N114_feather, centerSize.y * -.5 + N114_feather, N114_uv.y );
	N114_isCenter *= smoothstep( centerSize.y * .5 + N114_feather, centerSize.y * .5 - N114_feather, N114_uv.y );
	return smoothstep( 0., 1., N114_isCenter );
	
}

#pragma inline 
void N114_main()
{
	N114_isCenter = 1.;
	if( N114_cutOutCenter || N114_borderOnly ) {
		vec2 centerSize = N114_size + 2. - N114_margin * 2.;
		vec2 frameUv = N114_uv * (N114_size + 2.) * .5;
		N114_isCenter = N114_centerArea(frameUv, centerSize);
	}
}
void Node113_Bool_Parameter( out float Output, ssGlobals Globals ) { Output = ( borderOnly ) ? 1.0 : 0.0; }
void Node116_Bool_Parameter( out float Output, ssGlobals Globals ) { Output = ( cutOutCenter ) ? 1.0 : 0.0; }
void Node115_Float_Parameter( out float Output, ssGlobals Globals ) { Output = frameBorder; }
void Node114_IsCenter( in float borderOnly, in float cutOutCenter, in float2 uv, in float2 size, in float margin, out float isCenter, ssGlobals Globals )
{ 
	tempGlobals = Globals;
	
	isCenter = float( 0.0 );
	
	
	N114_borderOnly = bool( borderOnly );
	N114_cutOutCenter = bool( cutOutCenter );
	N114_uv = uv;
	N114_size = size;
	N114_margin = margin;
	
	N114_main();
	
	isCenter = N114_isCenter;
}
vec4 N102_grabZones_sample( int index ) { vec4 _result_memfunc = vec4( 0.0 ); _result_memfunc = grabZones[ clamp( index, 0, 7 ) ]; return _result_memfunc; }
float N102_grabZonesCount;
vec2 N102_uv;
vec2 N102_size;

float N102_isZone; 

const float N102_feather = 3.;

#pragma inline 
void N102_main()
{
	N102_isZone = 0.;
	
	// grab zones 
	if(N102_grabZonesCount > 0.){
		// add back in 2 to N102_size for world position matching		
		vec2 frameUv = N102_uv * ( N102_size + 2. ) * .5;
		
		for( int i = 0; i < int(N102_grabZonesCount); i += 1 ) {
			
			vec4 thisZone = N102_grabZones_sample(i);
			
			float currentZone = smoothstep( thisZone.x - N102_feather, thisZone.x + N102_feather, frameUv.x );
			currentZone *= smoothstep( thisZone.y - N102_feather, thisZone.y + N102_feather, frameUv.y );
			currentZone *= smoothstep( thisZone.z + N102_feather, thisZone.z - N102_feather, frameUv.x );
			currentZone *= smoothstep( thisZone.w + N102_feather, thisZone.w - N102_feather, frameUv.y );
			N102_isZone += smoothstep( 0., 1., currentZone );
		}
		
	}
	
	
}
#define Node101_Float_Array_Object_Parameter( SizeOut, Globals ) /*nothing*/
void Node104_Float_Parameter( out float Output, ssGlobals Globals ) { Output = grabZonesCount; }
void Node102_Circle_Zones( in float grabZonesCount, in float2 uv, in float2 size, out float isZone, ssGlobals Globals )
{ 
	tempGlobals = Globals;
	
	isZone = float( 0.0 );
	
	
	N102_grabZonesCount = grabZonesCount;
	N102_uv = uv;
	N102_size = size;
	
	N102_main();
	
	isZone = N102_isZone;
}
void Node111_Float_Parameter( out float Output, ssGlobals Globals ) { Output = dotsHighlightStop1; }
void Node112_Float_Parameter( out float Output, ssGlobals Globals ) { Output = dotsHighlightStop2; }
void Node126_Float_Parameter( out float Output, ssGlobals Globals ) { Output = dotsScalar; }
void Node81_circles( in float2 uv, in float2 size, in float cursorLength, in float isHovered, in float isCenter, in float isZone, in float dotsStop1, in float dotsStop2, in float borderOnly, in float circleScalar, out float circle, ssGlobals Globals )
{ 
	tempGlobals = Globals;
	
	circle = float( 0.0 );
	
	
	N81_uv = uv;
	N81_size = size;
	N81_cursorLength = cursorLength;
	N81_isHovered = isHovered;
	N81_isCenter = isCenter;
	N81_isZone = isZone;
	N81_dotsStop1 = dotsStop1;
	N81_dotsStop2 = dotsStop2;
	N81_borderOnly = bool( borderOnly );
	N81_circleScalar = circleScalar;
	
	N81_main();
	
	circle = N81_circle;
}
#define Node83_Mix( Input0, Input1, Input2, Output, Globals ) Output = mix( Input0, Input1, float4(Input2) )
vec4 N67_colors_sample( int index ) { vec4 _result_memfunc = vec4( 0.0 ); _result_memfunc = borderGradientColors[ clamp( index, 0, 5 ) ]; return _result_memfunc; }
float N67_percents_sample( int index ) { float _result_memfunc = float( 0.0 ); _result_memfunc = borderGradientPercents[ clamp( index, 0, 5 ) ]; return _result_memfunc; }
int N67_stops;
int N67_type;
vec2 N67_uv;
vec4 N67_backgroundColor;

float N67_linearGradientStart;
float N67_linearGradientEnd;
float N67_linearGradientAngle;
float N67_linearGradientLength;
vec2 N67_gradientStartPosition;
float N67_radialGradientLength;
float N67_rectDist;

vec4 N67_OutColor; 

#pragma inline 
void N67_main()
{
	if( N67_stops > 0 ) {
		// use gradient
		if( N67_type == 0 ) {
			// linear gradient 
			float uvX = N67_uv.x * cos(-N67_linearGradientAngle) - N67_uv.y * sin(-N67_linearGradientAngle);
			N67_OutColor = N67_colors_sample(0);
			N67_OutColor = mix(N67_OutColor, N67_colors_sample(1), smoothstep(
					N67_linearGradientStart + N67_percents_sample(0) * N67_linearGradientLength,
					N67_linearGradientStart + N67_percents_sample(1) * N67_linearGradientLength,
					uvX
				));
			if( N67_stops > 2 ) {
				for (int i = 1; i < N67_stops - 1; i++) {
					N67_OutColor = mix(N67_OutColor, N67_colors_sample(i + 1), smoothstep(
							N67_linearGradientStart + N67_percents_sample(i) * N67_linearGradientLength,
							N67_linearGradientStart + N67_percents_sample(i + 1) * N67_linearGradientLength,
							uvX
						));
				}	
			}
		} else if( N67_type == 1 ) {
			// radial gradient
			float radLength = distance( N67_uv, N67_gradientStartPosition ) / N67_radialGradientLength * .5;
			N67_OutColor = N67_colors_sample(0);
			N67_OutColor = mix(N67_OutColor, N67_colors_sample(1), smoothstep( 
					N67_percents_sample(0),
					N67_percents_sample(1),
					radLength
				));
			if( N67_stops > 2 ) {
				for (int i = 1; i < N67_stops - 1; i++) {
					N67_OutColor = mix(N67_OutColor, N67_colors_sample(i + 1), smoothstep( 
							N67_percents_sample(i),
							N67_percents_sample(i + 1),
							radLength
						));
				}	
			}
		} else if( N67_type == 2 ) { 
			float borderGrad = N67_rectDist;
			N67_OutColor = N67_colors_sample(0);
			N67_OutColor = mix(N67_OutColor, N67_colors_sample(1), smoothstep( 
					N67_percents_sample(0),
					N67_percents_sample(1),
					borderGrad
				));
			if( N67_stops > 2 ) {
				for (int i = 1; i < N67_stops - 1; i++) {
					N67_OutColor = mix(N67_OutColor, N67_colors_sample(i + 1), smoothstep( 
							N67_percents_sample(i),
							N67_percents_sample(i + 1),
							borderGrad
						));
				}	
			}
		}
	} else {
		N67_OutColor = N67_backgroundColor;
	}
}
void Node56_Float_Parameter( out float4 Output, ssGlobals Globals ) { Output = borderColor; }
#define Node70_Mix( Input0, Input1, Input2, Output, Globals ) Output = mix( Input0, Input1, float4(Input2) )
#define Node57_Float_Array_Object_Parameter( SizeOut, Globals ) /*nothing*/
#define Node58_Float_Array_Object_Parameter( SizeOut, Globals ) /*nothing*/
void Node59_Int_Parameter( out float Output, ssGlobals Globals ) { Output = float(borderGradientStops); }
void Node60_Float_Parameter( out float Output, ssGlobals Globals ) { Output = borderLinearGradientStart; }
void Node61_Float_Parameter( out float Output, ssGlobals Globals ) { Output = borderLinearGradientEnd; }
void Node62_Float_Parameter( out float Output, ssGlobals Globals ) { Output = borderLinearGradientAngle; }
void Node63_Float_Parameter( out float Output, ssGlobals Globals ) { Output = borderLinearGradientLength; }
void Node64_Float_Parameter( out float2 Output, ssGlobals Globals ) { Output = borderGradientStartPosition; }
void Node65_Float_Parameter( out float Output, ssGlobals Globals ) { Output = borderRadialGradientLength; }
void Node66_Float_Parameter( out float Output, ssGlobals Globals ) { Output = borderGradientType; }
void Node67_Border_Gradient( in float2 uv, in float4 backgroundColor, in float stops, in float linearGradientStart, in float linearGradientEnd, in float linearGradientAngle, in float linearGradientLength, in float2 gradientStartPosition, in float radialGradientLength, in float rectDist, in float type, out float4 OutColor, ssGlobals Globals )
{ 
	tempGlobals = Globals;
	
	OutColor = vec4( 0.0 );
	
	
	N67_uv = uv;
	N67_backgroundColor = backgroundColor;
	N67_stops = int( stops );
	N67_linearGradientStart = linearGradientStart;
	N67_linearGradientEnd = linearGradientEnd;
	N67_linearGradientAngle = linearGradientAngle;
	N67_linearGradientLength = linearGradientLength;
	N67_gradientStartPosition = gradientStartPosition;
	N67_radialGradientLength = radialGradientLength;
	N67_rectDist = rectDist;
	N67_type = int( type );
	
	N67_main();
	
	OutColor = N67_OutColor;
}
void Node109_Float_Parameter( out float Output, ssGlobals Globals ) { Output = edgeHighlightStop1; }
void Node110_Float_Parameter( out float Output, ssGlobals Globals ) { Output = edgeHighlightStop2; }
#define Node89_Smoothstep( Input0, Input1, Input2, Output, Globals ) Output = smoothstep( Input0, Input1, Input2 )
#define Node99_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node90_Max( Input0, Input1, Output, Globals ) Output = max( Input0, Input1 )
#define Node88_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node41_Mix( Input0, Input1, Input2, Output, Globals ) Output = mix( Input0, Input1, float4(Input2) )
void Node75_Split_Vector( in float4 Value, out float3 Value1, out float Value2, ssGlobals Globals )
{ 
	Value1 = Value.xyz;
	Value2 = Value.w;
}
#define Node119_Subtract( Input0, Input1, Output, Globals ) Output = Input0 - Input1
void Node117_If_else( in float Bool1, in float Value1, in float Default, out float Result, ssGlobals Globals )
{ 
	/* Input port: "Bool1"  */
	
	{
		float Output_N116 = 0.0; Node116_Bool_Parameter( Output_N116, Globals );
		
		Bool1 = Output_N116;
	}
	if ( bool( Bool1 * 1.0 != 0.0 ) )
	{
		/* Input port: "Value1"  */
		
		{
			float Output_N113 = 0.0; Node113_Bool_Parameter( Output_N113, Globals );
			float Output_N116 = 0.0; Node116_Bool_Parameter( Output_N116, Globals );
			float3 Position_N13 = float3(0.0); Node13_Surface_Position( Position_N13, Globals );
			float2 Output_N36 = float2(0.0); Node36_Float_Parameter( Output_N36, Globals );
			float2 Value_N23 = float2(0.0); Node23_Float_Import( Output_N36, Value_N23, Globals );
			float Value1_N37 = 0.0; float Value2_N37 = 0.0; Node37_Split_Vector( Value_N23, Value1_N37, Value2_N37, Globals );
			float2 Value_N14 = float2(0.0); Node14_Construct_Vector( Value1_N37, Value2_N37, Value_N14, Globals );
			float Output_N33 = 0.0; Node33_Float_Parameter( Output_N33, Globals );
			float Value_N24 = 0.0; Node24_Float_Import( Output_N33, Value_N24, Globals );
			float Output_N35 = 0.0; Node35_Subtract_One( Value_N24, Output_N35, Globals );
			float Output_N32 = 0.0; Node32_Multiply( Output_N35, NF_PORT_CONSTANT( float( 2.0 ), Port_Input1_N032 ), Output_N32, Globals );
			float2 Output_N34 = float2(0.0); Node34_Subtract( Value_N14, Output_N32, Output_N34, Globals );
			float2 Output_N25 = float2(0.0); Node25_Multiply( Output_N34, NF_PORT_CONSTANT( float2( 0.5, 0.5 ), Port_Input1_N025 ), Output_N25, Globals );
			float2 Output_N31 = float2(0.0); Node31_Add( Position_N13.xy, Output_N25, Output_N31, Globals );
			float Value1_N15 = 0.0; float Value2_N15 = 0.0; Node15_Split_Vector( Output_N34, Value1_N15, Value2_N15, Globals );
			float Output_N16 = 0.0; Node16_Multiply( NF_PORT_CONSTANT( float( -0.5 ), Port_Input0_N016 ), Value1_N15, Output_N16, Globals );
			float Output_N17 = 0.0; Node17_Multiply( NF_PORT_CONSTANT( float( -0.5 ), Port_Input0_N017 ), Value2_N15, Output_N17, Globals );
			float2 Value_N19 = float2(0.0); Node19_Construct_Vector( Output_N16, Output_N17, Value_N19, Globals );
			float2 Output_N18 = float2(0.0); Node18_Add( Output_N31, Value_N19, Output_N18, Globals );
			float2 Output_N26 = float2(0.0); Node26_Add( Output_N25, Value_N24, Output_N26, Globals );
			float2 Output_N22 = float2(0.0); Node22_Divide( Output_N18, Output_N26, Output_N22, Globals );
			float2 Export_N38 = float2(0.0); Node38_Float_Export( Output_N22, Export_N38, Globals );
			float Output_N115 = 0.0; Node115_Float_Parameter( Output_N115, Globals );
			float isCenter_N114 = 0.0; Node114_IsCenter( Output_N113, Output_N116, Export_N38, Output_N36, Output_N115, isCenter_N114, Globals );
			float Output_N119 = 0.0; Node119_Subtract( NF_PORT_CONSTANT( float( 1.0 ), Port_Input0_N119 ), isCenter_N114, Output_N119, Globals );
			
			Value1 = Output_N119;
		}
		Result = Value1;
	}
	else
	{
		
		Result = Default;
	}
}
void Node74_Float_Parameter( out float Output, ssGlobals Globals ) { Output = opacityFactor; }
#define Node78_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node118_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node76_Construct_Vector( Value1, Value2, Value, Globals ) Value.xyz = Value1; Value.w = Value2
//-----------------------------------------------------------------------------

void main() 
{
	if (bool(sc_DepthOnly)) {
		return;
	}
	
	
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	
	sc_DiscardStereoFragment();
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	NF_SETUP_PREVIEW_PIXEL()
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	float4 FinalColor = float4( 1.0, 1.0, 1.0, 1.0 );
	
	
	
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	ssGlobals Globals;	
	Globals.gTimeElapsed = sc_TimeElapsed;
	Globals.gTimeDelta   = sc_TimeDelta;
	
	
	{
		Globals.SurfacePosition_ObjectSpace = ( ngsModelMatrixInverse * float4( varPos, 1.0 ) ).xyz;
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	/* Input port: 'FinalColor'  */
	
	{
		float3 Position_N13 = float3(0.0); Node13_Surface_Position( Position_N13, Globals );
		float2 Output_N36 = float2(0.0); Node36_Float_Parameter( Output_N36, Globals );
		float2 Value_N23 = float2(0.0); Node23_Float_Import( Output_N36, Value_N23, Globals );
		float Value1_N37 = 0.0; float Value2_N37 = 0.0; Node37_Split_Vector( Value_N23, Value1_N37, Value2_N37, Globals );
		float2 Value_N14 = float2(0.0); Node14_Construct_Vector( Value1_N37, Value2_N37, Value_N14, Globals );
		float Output_N33 = 0.0; Node33_Float_Parameter( Output_N33, Globals );
		float Value_N24 = 0.0; Node24_Float_Import( Output_N33, Value_N24, Globals );
		float Output_N35 = 0.0; Node35_Subtract_One( Value_N24, Output_N35, Globals );
		float Output_N32 = 0.0; Node32_Multiply( Output_N35, NF_PORT_CONSTANT( float( 2.0 ), Port_Input1_N032 ), Output_N32, Globals );
		float2 Output_N34 = float2(0.0); Node34_Subtract( Value_N14, Output_N32, Output_N34, Globals );
		float2 Output_N25 = float2(0.0); Node25_Multiply( Output_N34, NF_PORT_CONSTANT( float2( 0.5, 0.5 ), Port_Input1_N025 ), Output_N25, Globals );
		float2 Output_N31 = float2(0.0); Node31_Add( Position_N13.xy, Output_N25, Output_N31, Globals );
		float Value1_N15 = 0.0; float Value2_N15 = 0.0; Node15_Split_Vector( Output_N34, Value1_N15, Value2_N15, Globals );
		float Output_N16 = 0.0; Node16_Multiply( NF_PORT_CONSTANT( float( -0.5 ), Port_Input0_N016 ), Value1_N15, Output_N16, Globals );
		float Output_N17 = 0.0; Node17_Multiply( NF_PORT_CONSTANT( float( -0.5 ), Port_Input0_N017 ), Value2_N15, Output_N17, Globals );
		float2 Value_N19 = float2(0.0); Node19_Construct_Vector( Output_N16, Output_N17, Value_N19, Globals );
		float2 Output_N18 = float2(0.0); Node18_Add( Output_N31, Value_N19, Output_N18, Globals );
		float2 Output_N26 = float2(0.0); Node26_Add( Output_N25, Value_N24, Output_N26, Globals );
		float2 Output_N22 = float2(0.0); Node22_Divide( Output_N18, Output_N26, Output_N22, Globals );
		float2 Export_N38 = float2(0.0); Node38_Float_Export( Output_N22, Export_N38, Globals );
		float2 TextureSize_N72 = float2(0.0); float2 PixelSize_N72 = float2(0.0); Node72_Texture_2D_Object_Parameter( TextureSize_N72, PixelSize_N72, Globals );
		float Output_N77 = 0.0; Node77_Float_Parameter( Output_N77, Globals );
		float2 Output_N79 = float2(0.0); Node79_Float_Parameter( Output_N79, Globals );
		float Output_N73 = 0.0; Node73_Float_Parameter( Output_N73, Globals );
		float4 Output_N40 = float4(0.0); Node40_Float_Parameter( Output_N40, Globals );
		float4 outColor_N80 = float4(0.0); Node80_Background( Output_N77, Output_N79, Output_N73, Export_N38, Output_N40, outColor_N80, Globals );
		float SizeOut_N52 = 0.0; Node52_Float_Array_Object_Parameter( SizeOut_N52, Globals );
		float SizeOut_N47 = 0.0; Node47_Float_Array_Object_Parameter( SizeOut_N47, Globals );
		float Output_N45 = 0.0; Node45_Int_Parameter( Output_N45, Globals );
		float Output_N48 = 0.0; Node48_Float_Parameter( Output_N48, Globals );
		float Output_N49 = 0.0; Node49_Float_Parameter( Output_N49, Globals );
		float Output_N50 = 0.0; Node50_Float_Parameter( Output_N50, Globals );
		float Output_N51 = 0.0; Node51_Float_Parameter( Output_N51, Globals );
		float2 Output_N53 = float2(0.0); Node53_Float_Parameter( Output_N53, Globals );
		float Output_N55 = 0.0; Node55_Float_Parameter( Output_N55, Globals );
		float Output_N71 = 0.0; Node71_Float_Parameter( Output_N71, Globals );
		float Output_N43 = 0.0; Node43_Multiply( NF_PORT_CONSTANT( float( 2.0 ), Port_Input0_N043 ), Output_N33, Output_N43, Globals );
		float Output_N42 = 0.0; Node42_Float_Parameter( Output_N42, Globals );
		float Output_N69 = 0.0; Node69_Multiply( NF_PORT_CONSTANT( float( 2.0 ), Port_Input0_N069 ), Output_N42, Output_N69, Globals );
		float Output_N44 = 0.0; Node44_Subtract( Output_N43, Output_N69, Output_N44, Globals );
		float Output_N68 = 0.0; Node68_Max( Output_N44, NF_PORT_CONSTANT( float( 0.0 ), Port_Input1_N068 ), Output_N68, Globals );
		float dist_N7 = 0.0; float rawDist_N7 = 0.0; Node7_Stroke( Output_N71, Output_N68, Output_N69, NF_PORT_CONSTANT( float( 0.03 ), Port_borderSoftness_N007 ), Export_N38, Output_N36, dist_N7, rawDist_N7, Globals );
		float Output_N54 = 0.0; Node54_Float_Parameter( Output_N54, Globals );
		float4 OutColor_N46 = float4(0.0); Node46_Gradient( Export_N38, outColor_N80, Output_N45, Output_N48, Output_N49, Output_N50, Output_N51, Output_N53, Output_N55, rawDist_N7, Output_N54, OutColor_N46, Globals );
		float4 Output_N123 = float4(0.0); Node123_Float_Parameter( Output_N123, Globals );
		float4 Output_N124 = float4(0.0); Node124_Float_Parameter( Output_N124, Globals );
		float Output_N107 = 0.0; Node107_Float_Parameter( Output_N107, Globals );
		float Output_N108 = 0.0; Node108_Float_Parameter( Output_N108, Globals );
		float2 Output_N85 = float2(0.0); Node85_Float_Parameter( Output_N85, Globals );
		float2 Output_N87 = float2(0.0); Node87_Subtract( Export_N38, Output_N85, Output_N87, Globals );
		float Output_N97 = 0.0; Node97_Float_Parameter( Output_N97, Globals );
		float Output_N105 = 0.0; Node105_Add( Output_N97, NF_PORT_CONSTANT( float( -2.0 ), Port_Input1_N105 ), Output_N105, Globals );
		float Output_N106 = 0.0; Node106_Max( Output_N105, NF_PORT_CONSTANT( float( 1.0 ), Port_Input1_N106 ), Output_N106, Globals );
		float2 Output_N94 = float2(0.0); Node94_Divide( Output_N87, Output_N106, Output_N94, Globals );
		float2 Output_N95 = float2(0.0); Node95_Multiply( Output_N94, Output_N36, Output_N95, Globals );
		float Output_N86 = 0.0; Node86_Length( Output_N95, Output_N86, Globals );
		float Output_N93 = 0.0; Node93_Smoothstep( Output_N107, Output_N108, Output_N86, Output_N93, Globals );
		float Output_N122 = 0.0; Node122_Pow( Output_N93, NF_PORT_CONSTANT( float( 1.5 ), Port_Input1_N122 ), Output_N122, Globals );
		float4 Output_N125 = float4(0.0); Node125_Mix( Output_N123, Output_N124, Output_N122, Output_N125, Globals );
		float4 Output_N121 = float4(0.0); Node121_Float_Parameter( Output_N121, Globals );
		float4 Output_N96 = float4(0.0); Node96_Float_Parameter( Output_N96, Globals );
		float4 Output_N120 = float4(0.0); Node120_Mix( Output_N121, Output_N96, Output_N122, Output_N120, Globals );
		float Output_N103 = 0.0; Node103_Float_Parameter( Output_N103, Globals );
		float4 Output_N84 = float4(0.0); Node84_Mix( Output_N125, Output_N120, Output_N103, Output_N84, Globals );
		float Output_N98 = 0.0; Node98_Float_Parameter( Output_N98, Globals );
		float Output_N100 = 0.0; Node100_Multiply( Output_N93, Output_N98, Output_N100, Globals );
		float4 Output_N91 = float4(0.0); Node91_Mix( OutColor_N46, Output_N84, Output_N100, Output_N91, Globals );
		Node82_Texture_2D_Object_Parameter( Globals );
		float Output_N113 = 0.0; Node113_Bool_Parameter( Output_N113, Globals );
		float Output_N116 = 0.0; Node116_Bool_Parameter( Output_N116, Globals );
		float Output_N115 = 0.0; Node115_Float_Parameter( Output_N115, Globals );
		float isCenter_N114 = 0.0; Node114_IsCenter( Output_N113, Output_N116, Export_N38, Output_N36, Output_N115, isCenter_N114, Globals );
		float SizeOut_N101 = 0.0; Node101_Float_Array_Object_Parameter( SizeOut_N101, Globals );
		float Output_N104 = 0.0; Node104_Float_Parameter( Output_N104, Globals );
		float isZone_N102 = 0.0; Node102_Circle_Zones( Output_N104, Export_N38, Output_N36, isZone_N102, Globals );
		float Output_N111 = 0.0; Node111_Float_Parameter( Output_N111, Globals );
		float Output_N112 = 0.0; Node112_Float_Parameter( Output_N112, Globals );
		float Output_N126 = 0.0; Node126_Float_Parameter( Output_N126, Globals );
		float circle_N81 = 0.0; Node81_circles( Export_N38, Output_N36, Output_N86, Output_N98, isCenter_N114, isZone_N102, Output_N111, Output_N112, Output_N113, Output_N126, circle_N81, Globals );
		float4 Output_N83 = float4(0.0); Node83_Mix( Output_N91, Output_N84, circle_N81, Output_N83, Globals );
		float4 Output_N56 = float4(0.0); Node56_Float_Parameter( Output_N56, Globals );
		float4 Output_N70 = float4(0.0); Node70_Mix( OutColor_N46, Output_N56, Output_N71, Output_N70, Globals );
		float SizeOut_N57 = 0.0; Node57_Float_Array_Object_Parameter( SizeOut_N57, Globals );
		float SizeOut_N58 = 0.0; Node58_Float_Array_Object_Parameter( SizeOut_N58, Globals );
		float Output_N59 = 0.0; Node59_Int_Parameter( Output_N59, Globals );
		float Output_N60 = 0.0; Node60_Float_Parameter( Output_N60, Globals );
		float Output_N61 = 0.0; Node61_Float_Parameter( Output_N61, Globals );
		float Output_N62 = 0.0; Node62_Float_Parameter( Output_N62, Globals );
		float Output_N63 = 0.0; Node63_Float_Parameter( Output_N63, Globals );
		float2 Output_N64 = float2(0.0); Node64_Float_Parameter( Output_N64, Globals );
		float Output_N65 = 0.0; Node65_Float_Parameter( Output_N65, Globals );
		float Output_N66 = 0.0; Node66_Float_Parameter( Output_N66, Globals );
		float4 OutColor_N67 = float4(0.0); Node67_Border_Gradient( Export_N38, Output_N70, Output_N59, Output_N60, Output_N61, Output_N62, Output_N63, Output_N64, Output_N65, rawDist_N7, Output_N66, OutColor_N67, Globals );
		float Output_N109 = 0.0; Node109_Float_Parameter( Output_N109, Globals );
		float Output_N110 = 0.0; Node110_Float_Parameter( Output_N110, Globals );
		float Output_N89 = 0.0; Node89_Smoothstep( Output_N109, Output_N110, Output_N86, Output_N89, Globals );
		float Output_N99 = 0.0; Node99_Multiply( Output_N98, Output_N89, Output_N99, Globals );
		float Output_N90 = 0.0; Node90_Max( Output_N99, NF_PORT_CONSTANT( float( 0.1 ), Port_Input1_N090 ), Output_N90, Globals );
		float Output_N88 = 0.0; Node88_Multiply( dist_N7, Output_N90, Output_N88, Globals );
		float4 Output_N41 = float4(0.0); Node41_Mix( Output_N83, OutColor_N67, Output_N88, Output_N41, Globals );
		float3 Value1_N75 = float3(0.0); float Value2_N75 = 0.0; Node75_Split_Vector( Output_N41, Value1_N75, Value2_N75, Globals );
		float Result_N117 = 0.0; Node117_If_else( float( 0.0 ), float( 0.0 ), NF_PORT_CONSTANT( float( 1.0 ), Port_Default_N117 ), Result_N117, Globals );
		float Output_N74 = 0.0; Node74_Float_Parameter( Output_N74, Globals );
		float Output_N78 = 0.0; Node78_Multiply( Value2_N75, Output_N74, Output_N78, Globals );
		float Output_N118 = 0.0; Node118_Multiply( Result_N117, Output_N78, Output_N118, Globals );
		float4 Value_N76 = float4(0.0); Node76_Construct_Vector( Value1_N75, Output_N118, Value_N76, Globals );
		
		FinalColor = Value_N76;
	}
	ngsAlphaTest( FinalColor.a );
	
	
	
	
	
	
	
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	
	FinalColor = ngsPixelShader( FinalColor );
	
	NF_PREVIEW_OUTPUT_PIXEL()
	
	#ifdef STUDIO
	vec4 Cost = getPixelRenderingCost();
	if ( Cost.w > 0.0 )
	FinalColor = Cost;
	#endif
	
	FinalColor = max( FinalColor, 0.0 );
	FinalColor = sc_OutputMotionVectorIfNeeded(FinalColor);
	processOIT( FinalColor );
	
	
}

#endif // #ifdef FRAGMENT_SHADER
