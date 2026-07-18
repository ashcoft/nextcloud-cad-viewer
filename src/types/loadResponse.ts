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
	/** Direct download URL for the CAD file */
	url: string
	contentType: string
	error?: string
}
