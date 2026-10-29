/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

export interface LoadResponse {
	id: number
	name: string
	size: number
	mimeType: string
	path: string
	/** User-visible folder the file lives in, for "back to Files" links. */
	directory: string
	/** Version of the file the metadata was read from. */
	etag: string
	/** Whether the drawing can be written back (DXF and writable). */
	canSave: boolean
	/** Direct download URL for the CAD file */
	url: string
	/** Viewer theme chosen by the administrator. */
	theme: 'light' | 'dark'
	contentType: string
	error?: string
}
